"use strict";
document.addEventListener("DOMContentLoaded", function () {
    var contentsMap = {
        about: { button: "aboutHandler", content: "aboutContents", isOpen: true },
        skills: {
            button: "skillsHandler",
            content: "skillsContents",
            isOpen: true,
        },
        education: {
            button: "educationHandler",
            content: "educationContents",
            isOpen: true,
        },
        studies: {
            button: "studiesHandler",
            content: "studiesContents",
            isOpen: true,
        },
        connect: {
            button: "connectHandler",
            content: "connectContents",
            isOpen: true,
        },
        experience: {
            button: "experienceHandler",
            content: "experienceContents",
            isOpen: true,
        },
        projects: {
            button: "projectsHandler",
            content: "projectsContents",
            isOpen: true,
        },
    };
    // 콘텐츠 가시성을 전환하는 함수
    function toggleContent(key) {
        console.log("toggleContent");
        var _a = contentsMap[key], content = _a.content, button = _a.button, isOpen = _a.isOpen;
        var contentElement = document.getElementById(content);
        var buttonElement = document.getElementById(button);
        if (contentElement && buttonElement) {
            contentsMap[key].isOpen = !isOpen;
            contentElement.style.maxHeight = contentsMap[key].isOpen
                ? "".concat(contentElement.scrollHeight, "px")
                : "0";
            // button 내의 img 요소 가져오기
            var buttonImage = buttonElement.querySelector("img");
            if (buttonImage) {
                // 이미지 src 업데이트
                buttonImage.src = contentsMap[key].isOpen
                    ? "./src/images/svg/circle_up.svg"
                    : "./src/images/svg/circle_down.svg";
                // alt 속성 업데이트
                buttonImage.alt = contentsMap[key].isOpen ? "close icon" : "open icon";
                // 콘솔로 alt 값 디버깅 (문제 파악용)
                console.log("Updated alt:", buttonImage.alt);
            }
        }
    }
    // 각 섹션 초기화 함수
    function initializeSections() {
        Object.keys(contentsMap).forEach(function (key) {
            var contentElement = document.getElementById(contentsMap[key].content);
            var buttonElement = document.getElementById(contentsMap[key].button);
            if (contentElement) {
                contentElement.style.maxHeight = contentsMap[key].isOpen
                    ? "".concat(contentElement.scrollHeight, "px")
                    : "0";
            }
            if (buttonElement) {
                buttonElement.addEventListener("click", function () { return toggleContent(key); });
            }
        });
    }
    // Copy 버튼 기능
    function showToast(message) {
        var toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(function () { return toast.classList.remove("show"); }, 2000);
    }
    // 복사 버튼 클릭 시
    var copyButtons = document.querySelectorAll(".copyButton");
    copyButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var textToCopy = button.getAttribute("data-clipboard-text");
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(function () {
                    showToast("Copied to clipboard!");
                });
            }
        });
    });
    // 경험 필터링 기능
    var expCheckboxes = {
        all: document.getElementById("expAll"),
        dev: document.getElementById("expDev"),
        etc: document.getElementById("expEtc"),
    };
    function experienceFilter() {
        var experienceItems = document.querySelectorAll("li[data-type]");
        var hasVisibleNoneType = false; // `none` 타입이 보여야 하는지 추적
        experienceItems.forEach(function (item) {
            var itemType = item.getAttribute("data-type");
            var displayStyle = (expCheckboxes.dev.checked && itemType === "developed") ||
                (expCheckboxes.etc.checked && itemType === "etc") ||
                (!expCheckboxes.dev.checked &&
                    !expCheckboxes.etc.checked &&
                    itemType === "none");
            item.style.display = displayStyle ? "" : "none";
            // `none` 타입이 표시 상태인지 확인
            if (itemType === "none" && displayStyle) {
                hasVisibleNoneType = true;
            }
        });
        var contentElement = document.getElementById("experienceContents");
        if (contentElement) {
            contentElement.style.maxHeight = "".concat(contentElement.scrollHeight, "px");
        }
        // noneTypeLiStyle 애니메이션 처리
        var _noneTypeLiStyle = document.getElementById("noneTypeLiStyle");
        if (_noneTypeLiStyle) {
            if (hasVisibleNoneType) {
                _noneTypeLiStyle.classList.add("show"); // 애니메이션 시작
            }
            else {
                _noneTypeLiStyle.classList.remove("show"); // 숨김 처리
            }
        }
    }
    function updateCheckboxStates() {
        var dev = expCheckboxes.dev, etc = expCheckboxes.etc, all = expCheckboxes.all;
        all.checked = dev.checked && etc.checked;
        if (!dev.checked && !etc.checked) {
            dev.checked = etc.checked = false;
            all.checked = false;
        }
    }
    function initializeCheckboxes() {
        var all = expCheckboxes.all, dev = expCheckboxes.dev, etc = expCheckboxes.etc;
        all.addEventListener("change", function () {
            dev.checked = etc.checked = all.checked;
            experienceFilter();
        });
        [dev, etc].forEach(function (checkbox) {
            checkbox.addEventListener("change", function () {
                updateCheckboxStates();
                experienceFilter();
            });
        });
    }
    // 경력 항목에 기간 추가
    function calculateMonths(startDate, endDate) {
        if (startDate && endDate) {
            var start = new Date(startDate.replace(".", "-") + "-01");
            var end = new Date(endDate.replace(".", "-") + "-01");
            return ((end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth()));
        }
        return null;
    }
    function updateExperienceLabels() {
        var experienceItems = document.querySelectorAll("ul > li[data-type]");
        experienceItems.forEach(function (item) {
            var startDate = item.getAttribute("data-start");
            var endDate = item.getAttribute("data-end");
            var months = calculateMonths(startDate, endDate);
            var dataType = item.getAttribute("data-type");
            if (months !== null && dataType) {
                var label = document.querySelector("label[for='exp".concat(dataType.charAt(0).toUpperCase() + dataType.slice(1), "']"));
                if (label)
                    label.innerText += " (".concat(months, " months)");
            }
        });
    }
    // 리사이징 이벤트 처리 함수
    function handleResize() {
        initializeSections();
    }
    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);
    /**
     * TO DO
     */
    // 초기화 함수 호출
    initializeSections();
    initializeCheckboxes();
    experienceFilter();
    updateExperienceLabels();
});
