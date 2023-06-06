import {createElement, logError} from "../utils";
import {toggleSettings} from "./settings";
import {seek, skip} from "../playback";

export function toggleFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(r => r);
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitsExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        this._.form.buttons.fullscreen.setAttribute("icon", "fullscreenOn");
    } else {
        let element = this._.element;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            // For stupid users with iPhone
            element = this._.form.video;
            if (element.webkitEnterFullscreen) {
                element.webkitEnterFullscreen();
            }
        }

        this._.form.buttons.fullscreen.setAttribute("icon", "fullscreenOff");
    }
}

export function generateButtons() {
    this._.form.buttons = {
        // Плей/пауза
        play: createElement("button", {
                icon: "playBtn",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    this._.playing ? this.pause() : this.play();
                };
            }
        ),
        // Отмотать на 10 секунд
        backward10: createElement("button", {
                icon: "backward10",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    seek.call(this, -10);
                };
            }
        ),
        // Перемотать на 10 секунд
        forward10: createElement("button", {
                icon: "forward10",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    seek.call(this, 10);
                };
            }
        ),
        // Предыдущий трек
        skip_previous: createElement("button", {
                icon: "skip_previous",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    skip.call(this, false);
                };
            }
        ),
        // Следующий трек
        skip_next: createElement("button", {
                icon: "skip_next",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    skip.call(this, true);
                };
            }
        ),
        // Кнопка полного экрана
        fullscreen: createElement("button", {
                icon: "fullscreenOn",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    toggleFullscreen.call(this);
                };
            }
        ),
        // Кнопка "Скопировать"
        copy_url: createElement("button", {
                icon: "copy",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    try {
                        if (window.isSecureContext && navigator.clipboard) {
                            navigator.clipboard.writeText(decodeURIComponent(window.location.origin + window.location.pathname) + "?p=1&t=" + encodeURIComponent(parseInt(this._.form.video.currentTime)) + "&a=" + localStorage.getItem("mt_mark_dubs") + "&s=" + localStorage.getItem("mt_mark_subtitles")).then(r => r);
                        } else {
                            let input = document.createElement("input");
                            this._.rootElement.appendChild(input);
                            input.value = decodeURIComponent(window.location.origin + window.location.pathname) + "?p=1&t=" + encodeURIComponent(parseInt(this._.form.video.currentTime)) + "&a=" + localStorage.getItem("mt_mark_dubs") + "&s=" + localStorage.getItem("mt_mark_subtitles");
                            input.select();
                            document.execCommand("copy");
                            input.remove();
                        }
                    } catch {
                        logError.call(this, "Извините, при создании ссылки произошла ошибка.");
                    }
                };
            }
        ),
        pip: createElement("button", {
                icon: "pipOn",
                class: "mjs__overlay-button",
            }, (el) => {
                el.onclick = () => {
                    if ("pictureInPictureEnabled" in document) {
                        if (this._.form.video !== document.pictureInPictureElement) {
                            this._.form.video.requestPictureInPicture().then(r => r);
                            el.setAttribute("icon", "pipOff");
                        } else {
                            document.exitPictureInPicture().then(r => r);
                            el.setAttribute("icon", "pipOn");
                        }
                    } else {
                        logError.call(this, "К сожалению, ваш браузер не поддерживает функцию «картинка в картинке».");
                    }
                };
            }
        ),
        // Открыть меню
        menu: createElement("button", {
                icon: "menu",
                class: "mjs__overlay-button",
            }, (el) => {
                el.addEventListener("click", () => {
                    toggleSettings.call(this);
                });
            }
        ),
    };
}
