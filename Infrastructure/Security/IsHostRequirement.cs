using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Task.CompletedTask;

            var routeParam = httpContextAccessor.HttpContext?.Request.RouteValues.FirstOrDefault(x => x.Key == "id");
            if (routeParam == null) return Task.CompletedTask;

            var activityId = Guid.Parse(routeParam.Value.Value.ToString());


            var activityAttendee = dbContext.ActivityAttendees.AsNoTracking().FirstOrDefault(aa => aa.AppUserId == userId && aa.ActivityId == activityId);
            if (activityAttendee == null) return Task.CompletedTask;

            if (activityAttendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
