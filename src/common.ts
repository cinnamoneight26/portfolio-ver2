type SectionData = {
  button: string;
  content: string;
  isOpen: boolean;
};

type Sections = {
  about: SectionData;
  skills: SectionData;
  education: SectionData;
  studies: SectionData;
  connect: SectionData;
  experience: SectionData;
  projects: SectionData;
};

document.addEventListener("DOMContentLoaded", () => {
  const contentsMap: Sections = {
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
  function toggleContent(key: keyof Sections) {
    console.log("toggleContent");
    const { content, button, isOpen } = contentsMap[key];
    const contentElement = document.getElementById(content);
    const buttonElement = document.getElementById(button);

    if (contentElement && buttonElement) {
      contentsMap[key].isOpen = !isOpen;
      contentElement.style.maxHeight = contentsMap[key].isOpen
        ? `${contentElement.scrollHeight}px`
        : "0";

      // button 내의 img 요소 가져오기
      const buttonImage = buttonElement.querySelector(
        "img"
      ) as HTMLImageElement | null;

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
    (Object.keys(contentsMap) as Array<keyof Sections>).forEach((key) => {
      const contentElement = document.getElementById(contentsMap[key].content);
      const buttonElement = document.getElementById(contentsMap[key].button);
      if (contentElement) {
        contentElement.style.maxHeight = contentsMap[key].isOpen
          ? `${contentElement.scrollHeight}px`
          : "0";
      }
      if (buttonElement) {
        buttonElement.addEventListener("click", () => toggleContent(key));
      }
    });
  }

  // Copy 버튼 기능
  function showToast(message: string) {
    const toast = document.getElementById("toast") as HTMLElement;
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2000);
  }
  // 복사 버튼 클릭 시
  const copyButtons = document.querySelectorAll(
    ".copyButton"
  ) as NodeListOf<HTMLElement>;
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const textToCopy = button.getAttribute("data-clipboard-text");
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("Copied to clipboard!");
        });
      }
    });
  });

  // 경험 필터링 기능
  const expCheckboxes = {
    all: document.getElementById("expAll") as HTMLInputElement,
    dev: document.getElementById("expDev") as HTMLInputElement,
    etc: document.getElementById("expEtc") as HTMLInputElement,
  };

  function experienceFilter() {
    const experienceItems = document.querySelectorAll(
      "li[data-type]"
    ) as NodeListOf<HTMLElement>;

    let hasVisibleNoneType = false; // `none` 타입이 보여야 하는지 추적

    experienceItems.forEach((item) => {
      const itemType = item.getAttribute("data-type");

      const displayStyle =
        (expCheckboxes.dev.checked && itemType === "developed") ||
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

    const contentElement = document.getElementById("experienceContents");
    if (contentElement) {
      contentElement.style.maxHeight = `${contentElement.scrollHeight}px`;
    }

    // noneTypeLiStyle 애니메이션 처리
    const _noneTypeLiStyle = document.getElementById("noneTypeLiStyle");
    if (_noneTypeLiStyle) {
      if (hasVisibleNoneType) {
        _noneTypeLiStyle.classList.add("show"); // 애니메이션 시작
      } else {
        _noneTypeLiStyle.classList.remove("show"); // 숨김 처리
      }
    }
  }

  function updateCheckboxStates() {
    const { dev, etc, all } = expCheckboxes;
    all.checked = dev.checked && etc.checked;

    if (!dev.checked && !etc.checked) {
      dev.checked = etc.checked = false;
      all.checked = false;
    }
  }

  function initializeCheckboxes() {
    const { all, dev, etc } = expCheckboxes;
    all.addEventListener("change", () => {
      dev.checked = etc.checked = all.checked;
      experienceFilter();
    });
    [dev, etc].forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateCheckboxStates();
        experienceFilter();
      });
    });
  }

  // 경력 항목에 기간 추가
  function calculateMonths(
    startDate: string | null,
    endDate: string | null
  ): number | null {
    if (startDate && endDate) {
      const start = new Date(startDate.replace(".", "-") + "-01");
      const end = new Date(endDate.replace(".", "-") + "-01");
      return (
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth())
      );
    }
    return null;
  }

  function updateExperienceLabels() {
    const experienceItems = document.querySelectorAll("ul > li[data-type]");
    experienceItems.forEach((item) => {
      const startDate = item.getAttribute("data-start");
      const endDate = item.getAttribute("data-end");
      const months = calculateMonths(startDate, endDate);
      const dataType = item.getAttribute("data-type");
      if (months !== null && dataType) {
        const label = document.querySelector(
          `label[for='exp${dataType.charAt(0).toUpperCase() + dataType.slice(1)}']`
        ) as HTMLElement;
        if (label) label.innerText += ` (${months} months)`;
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
