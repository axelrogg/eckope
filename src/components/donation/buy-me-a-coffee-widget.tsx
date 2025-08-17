"use client";

import React, { useEffect } from "react";

export const BuyMeACoffeeWidget = () => {
    useEffect(() => {
        const script = document.createElement("script");
        const div = document.getElementById("supportByBMC");
        script.setAttribute("data-name", "BMC-Widget");
        script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
        script.setAttribute("data-id", "axelrogg");
        script.setAttribute("data-description", "Apoya el proyecto en Buy Me a Coffee");
        script.setAttribute(
            "data-message",
            "Éckope es un proyecto comunitario 🌱. Si crees en lo que hacemos y quieres ayudarnos a mantenerlo en línea, puedes invitarnos un café ☕. ¡Cada aporte suma!"
        );
        script.setAttribute("data-color", "#BD5FFF");
        script.setAttribute("data-position", "Right");
        script.setAttribute("data-x_margin", "18");
        script.setAttribute("data-y_margin", "18");
        script.async = false;
        document.head.appendChild(script);
        script.onload = function () {
            const evt = document.createEvent("Event");
            evt.initEvent("DOMContentLoaded", false, false);
            window.dispatchEvent(evt);
        };
        if (!div) return;
        div.appendChild(script);
    }, []);

    return <div id="supportByBMC"></div>;
};
