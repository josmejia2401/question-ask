// src/store/index.js

export class CommonStore {
    static data = {
        status: "unset",
        questions: []
    };

    static getState() {
        if (CommonStore.data.status === "set") {
            return CommonStore.data;
        }
        const stored = localStorage.getItem("common");
        return stored ? JSON.parse(stored) : { ...CommonStore.data };
    }

    static setQuestions(questions) {
        CommonStore.data.status = "set";
        CommonStore.data.questions = questions;
        localStorage.setItem("common", JSON.stringify(CommonStore.data));
    }
}