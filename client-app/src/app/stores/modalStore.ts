import { makeAutoObservable } from "mobx"

interface Modal {
    open: boolean,
    body: JSX.Element | null,
    closeOnDimmerClick: boolean
}

export default class ModalStore {
    model: Modal = {
        open: false,
        body: null,
        closeOnDimmerClick: true
    }

    constructor() {
        makeAutoObservable(this)
    }

    openModal = (content: JSX.Element, closeOnDimmerClick: boolean = true) => {
        this.model.open = true;
        this.model.body = content;
        this.model.closeOnDimmerClick = closeOnDimmerClick;
    }

    closeModal = () => {
        this.model.open = false;
        this.model.body = null;
    }
}