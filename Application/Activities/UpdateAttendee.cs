using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    // If the current user is the host of the Activity, then it will toggle the IsCancelled value.
    // Otherwise, it will add the user as attendee if the user is not in the attendees (or remove the user from the attendees if the user is in the attendees)
    public class UpdateAttendee
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.Include(a => a.Attendees).ThenInclude(aa => aa.AppUser).FirstOrDefaultAsync(x => x.Id == request.ActivityId);
                if (activity == null) return null;

                var currentUser = await context.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());
                if (currentUser == null) return null;

                var attendee = activity.Attendees.FirstOrDefault(a => a.AppUser.Id == currentUser.Id);
                if (attendee != null)
                {
                    if (attendee.IsHost)
                    {
                        activity.IsCancelled = !activity.IsCancelled;
                    }
                    else
                    {
                        activity.Attendees.Remove(attendee);
                    }
                }
                else
                {
                    var newAttendee = new ActivityAttendee
                    {
                        AppUser = currentUser,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(newAttendee);
                }

                var saveSucceed = await context.SaveChangesAsync() > 0;

                return saveSucceed ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendee");
            }
        }
    }
}
