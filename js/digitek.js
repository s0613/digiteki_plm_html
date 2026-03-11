/**
 * digitek.js — Digitek PLM 바닐라 JS 인터랙션 라이브러리
 *
 * IIFE 패턴으로 file:// 프로토콜에서도 동작하며,
 * window.Digitek 네임스페이스를 통해 프로그래밍 접근 가능.
 *
 * <script src="scripts/digitek.js"></script> 한 줄 추가로 모든 인터랙션 활성화.
 */
(function () {
  "use strict";

  /* ================================================================== */
  /*  유틸리티 헬퍼                                                       */
  /* ================================================================== */

  /**
   * 이벤트 위임 — document 레벨 리스너로 동적 콘텐츠 자동 지원
   * @param {string} eventType
   * @param {string} selector
   * @param {function} handler - (event, matchedElement) => void
   */
  function delegateEvent(eventType, selector, handler) {
    document.addEventListener(eventType, function (e) {
      var target = e.target;
      while (target && target !== document) {
        if (target.matches && target.matches(selector)) {
          handler(e, target);
          return;
        }
        target = target.parentElement;
      }
    });
  }

  /**
   * DOM 요소 생성 헬퍼
   */
  function createEl(tag, classes, attrs, text) {
    var el = document.createElement(tag);
    if (classes) el.className = classes;
    if (attrs) {
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) el.setAttribute(key, attrs[key]);
      }
    }
    if (text) el.textContent = text;
    return el;
  }

  /**
   * 커스텀 이벤트 발행
   */
  function emit(el, eventName, detail) {
    el.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: detail || {} }));
  }


  /* ================================================================== */
  /*  Accordion                                                          */
  /* ================================================================== */

  var Accordion = {
    init: function () {
      // PageAccordion
      delegateEvent("click", ".accordion-digitek-page-header", function (e, header) {
        // 우측 영역 클릭 시 토글 방지
        if (e.target.closest && e.target.closest(".accordion-digitek-page-header-right")) return;
        Accordion._toggle(header, "page");
      });

      // InnerAccordion
      delegateEvent("click", ".accordion-digitek-inner-header", function (e, header) {
        if (e.target.closest && e.target.closest(".accordion-digitek-inner-header-right")) return;
        Accordion._toggle(header, "inner");
      });

      // 키보드: Enter / Space
      delegateEvent("keydown", ".accordion-digitek-page-header", function (e, header) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (e.target.closest && e.target.closest(".accordion-digitek-page-header-right")) return;
          Accordion._toggle(header, "page");
        }
      });
      delegateEvent("keydown", ".accordion-digitek-inner-header", function (e, header) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (e.target.closest && e.target.closest(".accordion-digitek-inner-header-right")) return;
          Accordion._toggle(header, "inner");
        }
      });
    },

    _toggle: function (header, type) {
      var prefix = "accordion-digitek-" + type;
      var openClass = prefix + "-header-open";
      var isOpen = header.classList.contains(openClass);

      // 토글 open 클래스
      header.classList.toggle(openClass);

      // aria-expanded 업데이트
      header.setAttribute("aria-expanded", isOpen ? "false" : "true");

      // 쉐브론 토글
      var chevron = header.querySelector(".accordion-digitek-chevron, [class*='dicon-chevron']");
      if (chevron) {
        chevron.classList.toggle("accordion-digitek-chevron-closed", isOpen);
      }

      // 컨텐츠 영역 토글
      var content = header.nextElementSibling;
      var contentClass = prefix + "-content";
      if (content && content.classList.contains(contentClass)) {
        if (isOpen) {
          content.setAttribute("hidden", "");
        } else {
          content.removeAttribute("hidden");
        }
      }
    },
  };


  /* ================================================================== */
  /*  TabButton                                                          */
  /* ================================================================== */

  var TabButton = {
    init: function () {
      delegateEvent("click", ".tab-digitek", function (e, tab) {
        var group = tab.closest(".tab-digitek-group");
        if (!group) return;

        // 형제 탭에서 active 제거
        var tabs = group.querySelectorAll(".tab-digitek");
        tabs.forEach(function (t) {
          t.classList.remove("tab-digitek-active");
          t.setAttribute("aria-selected", "false");
        });

        // 클릭한 탭에 active 추가
        tab.classList.add("tab-digitek-active");
        tab.setAttribute("aria-selected", "true");

        emit(tab, "digitek:tab-change", { tab: tab, label: tab.textContent.trim() });
      });
    },
  };


  /* ================================================================== */
  /*  Sidebar                                                            */
  /* ================================================================== */

  var _sidebarItemH = null;
  function getSidebarItemH() {
    if (_sidebarItemH === null) {
      _sidebarItemH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--sidebar-item-height")
      ) || 36;
    }
    return _sidebarItemH;
  }

  var Sidebar = {
    init: function () {
      // 토글 버튼 (접기/펼치기) — 사이드바 내부 또는 GNB 헤더에서 동작
      delegateEvent("click", ".sidebar-toggle-btn", function (e, btn) {
        var nav = btn.closest(".sidebar-digitek");
        if (!nav) {
          // 사이드바 외부 버튼(핸들 등) → 레이아웃 내 사이드바 찾기
          var layout = btn.closest(".layout-digitek");
          nav = layout ? layout.querySelector(".sidebar-digitek") : null;
        }
        if (!nav) return;
        Sidebar._toggleCollapse(nav);
      });

      // 1레벨 메뉴 클릭
      delegateEvent("click", ".sidebar-digitek-menu-item", function (e, item) {
        e.preventDefault();
        var nav = item.closest(".sidebar-digitek");
        if (!nav) return;

        var li = item.closest(".nav-item");
        var submenu = li ? li.querySelector(".sidebar-digitek-submenu") : null;
        var isCollapsed = nav.classList.contains("sidebar-digitek-collapsed");

        if (submenu && !isCollapsed) {
          // 서브메뉴가 있으면 토글
          var isExpanded = parseInt(submenu.style.maxHeight) > 0;
          if (isExpanded) {
            submenu.style.maxHeight = "0px";
            item.setAttribute("aria-expanded", "false");
            // 서브 서브메뉴도 닫기
            submenu.querySelectorAll(".sidebar-digitek-sub-submenu").forEach(function (ss) {
              ss.style.maxHeight = "0px";
            });
            // 쉐브론 닫기
            var chev = item.querySelector(".sidebar-digitek-chevron");
            if (chev) chev.classList.remove("sidebar-digitek-chevron-open");
            item.classList.remove("sidebar-digitek-active");
            item.classList.remove("sidebar-digitek-parent-open");
            // 하위 쉐브론도 닫기
            submenu.querySelectorAll(".sidebar-digitek-chevron").forEach(function (c) {
              c.classList.remove("sidebar-digitek-chevron-open");
            });
          } else {
            // 다른 메뉴 닫기
            nav.querySelectorAll(".sidebar-digitek-submenu").forEach(function (sm) {
              if (sm !== submenu) {
                sm.style.maxHeight = "0px";
                var parentItem = sm.closest(".nav-item").querySelector(".sidebar-digitek-menu-item");
                if (parentItem) {
                  parentItem.classList.remove("sidebar-digitek-active");
                  parentItem.classList.remove("sidebar-digitek-parent-open");
                  parentItem.setAttribute("aria-expanded", "false");
                }
                var pChev = parentItem ? parentItem.querySelector(".sidebar-digitek-chevron") : null;
                if (pChev) pChev.classList.remove("sidebar-digitek-chevron-open");
              }
            });
            nav.querySelectorAll(".sidebar-digitek-sub-submenu").forEach(function (ss) {
              ss.style.maxHeight = "0px";
            });
            nav.querySelectorAll(".sidebar-digitek-submenu .sidebar-digitek-chevron").forEach(function (c) {
              c.classList.remove("sidebar-digitek-chevron-open");
            });

            // 열기
            var count = submenu.querySelectorAll(":scope > .nav-item").length;
            submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
            item.setAttribute("aria-expanded", "true");
            var chev = item.querySelector(".sidebar-digitek-chevron");
            if (chev) chev.classList.add("sidebar-digitek-chevron-open");
            item.classList.add("sidebar-digitek-active");
            item.classList.add("sidebar-digitek-parent-open");
          }
        } else if (!submenu || isCollapsed) {
          // 서브메뉴 없거나 축소 상태 → 활성 표시만
          nav.querySelectorAll(".sidebar-digitek-active").forEach(function (a) {
            a.classList.remove("sidebar-digitek-active");
          });
          nav.querySelectorAll(".sidebar-digitek-sub-active").forEach(function (a) {
            a.classList.remove("sidebar-digitek-sub-active");
          });
          item.classList.add("sidebar-digitek-active");
        }
      });

      // 2레벨 서브메뉴 클릭
      delegateEvent("click", ".sidebar-digitek-submenu-item", function (e, item) {
        e.preventDefault();
        var nav = item.closest(".sidebar-digitek");
        var li = item.closest(".nav-item");
        var subSubmenu = li ? li.querySelector(".sidebar-digitek-sub-submenu") : null;

        if (subSubmenu) {
          // 3레벨이 있으면 토글
          var isExpanded = parseInt(subSubmenu.style.maxHeight) > 0;
          if (isExpanded) {
            subSubmenu.style.maxHeight = "0px";
            item.setAttribute("aria-expanded", "false");
            var chev = item.querySelector(".sidebar-digitek-chevron");
            if (chev) chev.classList.remove("sidebar-digitek-chevron-open");
          } else {
            // 다른 3레벨 닫기
            var parentSubmenu = item.closest(".sidebar-digitek-submenu");
            if (parentSubmenu) {
              parentSubmenu.querySelectorAll(".sidebar-digitek-sub-submenu").forEach(function (ss) {
                if (ss !== subSubmenu) ss.style.maxHeight = "0px";
              });
              parentSubmenu.querySelectorAll(".sidebar-digitek-chevron").forEach(function (c) {
                var subItem = c.closest(".sidebar-digitek-submenu-item");
                if (subItem && subItem !== item) {
                  c.classList.remove("sidebar-digitek-chevron-open");
                  subItem.setAttribute("aria-expanded", "false");
                }
              });
            }

            var count = subSubmenu.querySelectorAll(":scope > .nav-item").length;
            subSubmenu.style.maxHeight = (count * getSidebarItemH()) + "px";
            item.setAttribute("aria-expanded", "true");
            var chev = item.querySelector(".sidebar-digitek-chevron");
            if (chev) chev.classList.add("sidebar-digitek-chevron-open");

            // 부모 submenu 높이 재계산
            Sidebar._recalcParentHeight(nav, parentSubmenu);
          }
        } else {
          // 3레벨 없으면 활성 표시
          nav.querySelectorAll(".sidebar-digitek-sub-active").forEach(function (a) {
            a.classList.remove("sidebar-digitek-sub-active");
          });
          nav.querySelectorAll(".sidebar-digitek-submenu-item.sidebar-digitek-active").forEach(function (a) {
            a.classList.remove("sidebar-digitek-active");
          });
          // 부모 1레벨 메뉴의 active 제거 (하양 배경 이중 방지)
          nav.querySelectorAll(".sidebar-digitek-menu-item.sidebar-digitek-active").forEach(function (a) {
            a.classList.remove("sidebar-digitek-active");
          });
          item.classList.add("sidebar-digitek-active");
        }
      });

      // 3레벨 서브서브메뉴 클릭
      delegateEvent("click", ".sidebar-digitek-sub-submenu-item", function (e, item) {
        e.preventDefault();
        var nav = item.closest(".sidebar-digitek");
        nav.querySelectorAll(".sidebar-digitek-sub-active").forEach(function (a) {
          a.classList.remove("sidebar-digitek-sub-active");
        });
        nav.querySelectorAll(".sidebar-digitek-submenu-item.sidebar-digitek-active").forEach(function (a) {
          a.classList.remove("sidebar-digitek-active");
        });
        // 부모 1레벨 메뉴의 active 제거 (하양 배경 이중 방지)
        nav.querySelectorAll(".sidebar-digitek-menu-item.sidebar-digitek-active").forEach(function (a) {
          a.classList.remove("sidebar-digitek-active");
        });
        item.classList.add("sidebar-digitek-sub-active");
      });

      // 서버 렌더링된 active 메뉴의 서브메뉴 자동 열기 (Thymeleaf SSR용)
      document.querySelectorAll(".sidebar-digitek-submenu").forEach(function (submenu) {
        if (!submenu.querySelector(".sidebar-digitek-active")) return;
        var count = submenu.querySelectorAll(":scope > .nav-item").length;
        submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
        var parentItem = submenu.previousElementSibling;
        if (parentItem) {
          parentItem.setAttribute("aria-expanded", "true");
          parentItem.classList.add("sidebar-digitek-parent-open");
          var chev = parentItem.querySelector(".sidebar-digitek-chevron");
          if (chev) chev.classList.add("sidebar-digitek-chevron-open");
        }
      });
      document.querySelectorAll(".sidebar-digitek-sub-submenu").forEach(function (submenu) {
        if (!submenu.querySelector(".sidebar-digitek-active")) return;
        var count = submenu.querySelectorAll(":scope > .nav-item").length;
        submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
        var parentItem = submenu.previousElementSibling;
        if (parentItem) {
          parentItem.setAttribute("aria-expanded", "true");
          var chev = parentItem.querySelector(".sidebar-digitek-chevron");
          if (chev) chev.classList.add("sidebar-digitek-chevron-open");
        }
        var parentSubmenu = submenu.closest(".sidebar-digitek-submenu");
        if (parentSubmenu) {
          Sidebar._recalcParentHeight(null, parentSubmenu);
          var grandParentItem = parentSubmenu.previousElementSibling;
          if (grandParentItem) {
            grandParentItem.setAttribute("aria-expanded", "true");
            grandParentItem.classList.add("sidebar-digitek-parent-open");
            var chev2 = grandParentItem.querySelector(".sidebar-digitek-chevron");
            if (chev2) chev2.classList.add("sidebar-digitek-chevron-open");
          }
        }
      });

      // 페이지 로드 시 접힘 상태 복원
      var nav = document.querySelector(".sidebar-digitek");
      if (nav && localStorage.getItem("sidebar-collapsed") === "true") {
        Sidebar._toggleCollapse(nav);
      }
    },

    _toggleCollapse: function (nav) {
      var isExpanded = nav.classList.contains("sidebar-digitek-expanded");
      if (isExpanded) {
        nav.classList.remove("sidebar-digitek-expanded");
        nav.classList.add("sidebar-digitek-collapsed");
        // 축소 시 모든 서브메뉴 닫기
        nav.querySelectorAll(".sidebar-digitek-submenu").forEach(function (sm) {
          sm.style.maxHeight = "0px";
        });
        nav.querySelectorAll(".sidebar-digitek-sub-submenu").forEach(function (ss) {
          ss.style.maxHeight = "0px";
        });
        nav.querySelectorAll(".sidebar-digitek-chevron-open").forEach(function (c) {
          c.classList.remove("sidebar-digitek-chevron-open");
        });
        // aria-expanded 닫기
        nav.querySelectorAll(".sidebar-digitek-menu-item[aria-expanded]").forEach(function (item) {
          item.setAttribute("aria-expanded", "false");
        });
        nav.querySelectorAll(".sidebar-digitek-submenu-item[aria-expanded]").forEach(function (item) {
          item.setAttribute("aria-expanded", "false");
        });
        // parent-open 제거 (접힌 상태에서는 서브메뉴 닫힘)
        nav.querySelectorAll(".sidebar-digitek-parent-open").forEach(function (item) {
          item.classList.remove("sidebar-digitek-parent-open");
        });
        // 로고 전환은 CSS가 처리 (.sidebar-logo-full / .sidebar-logo-collapsed)
        localStorage.setItem("sidebar-collapsed", "true");
      } else {
        nav.classList.remove("sidebar-digitek-collapsed");
        nav.classList.add("sidebar-digitek-expanded");
        localStorage.setItem("sidebar-collapsed", "false");
      }
    },

    _recalcParentHeight: function (nav, submenu) {
      if (!submenu) return;
      var parentLi = submenu.closest(".nav-item");
      var parentItem = parentLi ? parentLi.querySelector(".sidebar-digitek-menu-item") : null;
      if (!parentItem) return;

      var count = submenu.querySelectorAll(":scope > .nav-item").length;
      // 3레벨 확장분 추가
      submenu.querySelectorAll(".sidebar-digitek-sub-submenu").forEach(function (ss) {
        if (parseInt(ss.style.maxHeight) > 0) {
          count += ss.querySelectorAll(":scope > .nav-item").length;
        }
      });
      submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
    },
  };


  /* ================================================================== */
  /*  FileUpload                                                         */
  /* ================================================================== */

  var FileUpload = {
    init: function () {
      // 클릭으로 파일 선택
      delegateEvent("click", ".file-upload-digitek", function (e, zone) {
        var input = zone.querySelector(".file-upload-digitek-input, input[type='file']");
        if (input) input.click();
      });

      // 키보드: Enter / Space
      delegateEvent("keydown", ".file-upload-digitek", function (e, zone) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var input = zone.querySelector(".file-upload-digitek-input, input[type='file']");
          if (input) input.click();
        }
      });

      // 드래그 오버
      delegateEvent("dragover", ".file-upload-digitek", function (e, zone) {
        e.preventDefault();
        zone.classList.add("file-upload-digitek-dragging");
      });

      // 드래그 리브
      delegateEvent("dragleave", ".file-upload-digitek", function (e, zone) {
        zone.classList.remove("file-upload-digitek-dragging");
      });

      // 드롭
      delegateEvent("drop", ".file-upload-digitek", function (e, zone) {
        e.preventDefault();
        zone.classList.remove("file-upload-digitek-dragging");
        var files = e.dataTransfer ? e.dataTransfer.files : null;
        if (files && files.length > 0) {
          emit(zone, "digitek:files-dropped", { files: Array.from(files) });
        }
      });

      // 파일 카드 삭제
      delegateEvent("click", ".digitek-file-card-remove", function (e, btn) {
        e.stopPropagation();
        var card = btn.closest(".digitek-file-card");
        if (card) {
          var name = card.querySelector(".digitek-file-card-name");
          emit(card, "digitek:file-removed", { name: name ? name.textContent : "" });
          card.remove();
        }
      });
    },
  };


  /* ================================================================== */
  /*  GNB Search                                                         */
  /* ================================================================== */

  var GNBSearch = {
    init: function () {
      // Enter 키 검색
      delegateEvent("keydown", ".gnb-digitek-search-field", function (e, input) {
        if (e.key === "Enter") {
          e.preventDefault();
          emit(input, "digitek:gnb-search", { query: input.value });
        }
      });

      // 검색 버튼 클릭
      delegateEvent("click", ".gnb-digitek-search-btn", function (e, btn) {
        var wrap = btn.closest(".gnb-digitek-search-wrap");
        var input = wrap ? wrap.querySelector(".gnb-digitek-search-field") : null;
        if (input) {
          emit(input, "digitek:gnb-search", { query: input.value });
        }
      });

      // 프로필 div[role="button"] 키보드 지원 (Enter/Space)
      delegateEvent("keydown", ".gnb-digitek-profile[role='button']", function (e, el) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.click();
        }
      });
    },
  };


  /* ================================================================== */
  /*  Select                                                             */
  /* ================================================================== */

  var Select = {
    _openSelect: null,

    init: function () {
      // 트리거 클릭 → 드롭다운 열기/닫기
      delegateEvent("click", ".select-digitek-trigger", function (e, trigger) {
        if (trigger.classList.contains("select-digitek-trigger-disabled")) return;
        if (trigger.hasAttribute("disabled")) return;

        var container = trigger.closest(".select-digitek");
        if (!container) return;

        var isOpen = trigger.classList.contains("select-digitek-trigger-open");
        Select._closeAll();

        if (!isOpen) {
          Select._open(container, trigger);
        }
      });

      // 옵션 클릭
      delegateEvent("click", ".select-digitek-option", function (e, option) {
        var container = option.closest(".select-digitek");
        if (!container) return;

        var trigger = container.querySelector(".select-digitek-trigger");
        var textEl = trigger ? trigger.querySelector(".select-digitek-text, .select-digitek-placeholder") : null;

        // 선택 표시
        container.querySelectorAll(".select-digitek-option").forEach(function (opt) {
          opt.classList.remove("select-digitek-option-selected");
        });
        option.classList.add("select-digitek-option-selected");

        // 트리거 텍스트 업데이트
        if (textEl) {
          textEl.textContent = option.textContent.trim();
          textEl.classList.remove("select-digitek-placeholder");
          textEl.className = textEl.className.replace("select-digitek-placeholder", "").trim();
          if (!textEl.classList.contains("select-digitek-text")) {
            textEl.classList.add("select-digitek-text");
          }
        }

        // 숨겨진 <select> 동기화
        var hiddenSelect = container.querySelector("select");
        if (hiddenSelect && option.dataset.value !== undefined) {
          hiddenSelect.value = option.dataset.value;
        }

        Select._close(container);
        emit(container, "digitek:select-change", {
          value: option.dataset.value || option.textContent.trim(),
          label: option.textContent.trim(),
        });
      });

      // 외부 클릭 닫기
      if (!Select._mousedownBound) {
        Select._mousedownBound = true;
        document.addEventListener("mousedown", function (e) {
          if (Select._openSelect && !Select._openSelect.contains(e.target)) {
            Select._closeAll();
          }
        });
      }
    },

    _open: function (container, trigger) {
      trigger.classList.add("select-digitek-trigger-open");
      trigger.setAttribute("aria-expanded", "true");

      // 쉐브론 회전
      var chevron = trigger.querySelector(".select-digitek-chevron, .select-digitek-icon");
      if (chevron) chevron.style.transform = "rotate(180deg)";

      // 드롭다운 생성 (3단계 폴백)
      var dropdown = container.querySelector(".select-digitek-dropdown");
      if (!dropdown) {
        dropdown = Select._createDropdown(container);
      }
      if (dropdown) {
        dropdown.style.display = "";
        dropdown.removeAttribute("hidden");
      }

      Select._openSelect = container;
    },

    _close: function (container) {
      var trigger = container.querySelector(".select-digitek-trigger");
      if (trigger) {
        trigger.classList.remove("select-digitek-trigger-open");
        trigger.setAttribute("aria-expanded", "false");
        var chevron = trigger.querySelector(".select-digitek-chevron, .select-digitek-icon");
        if (chevron) chevron.style.transform = "";
      }
      var dropdown = container.querySelector(".select-digitek-dropdown");
      if (dropdown) dropdown.style.display = "none";
      if (Select._openSelect === container) Select._openSelect = null;
    },

    _closeAll: function () {
      document.querySelectorAll(".select-digitek-trigger-open").forEach(function (trigger) {
        var container = trigger.closest(".select-digitek");
        if (container) Select._close(container);
      });
      Select._openSelect = null;
    },

    _createDropdown: function (container) {
      var trigger = container.querySelector(".select-digitek-trigger");

      // 방법 1: data-options JSON
      var optionsJson = container.dataset.options || (trigger && trigger.dataset.options);
      if (optionsJson) {
        try {
          var options = JSON.parse(optionsJson);
          return Select._buildDropdown(container, options);
        } catch (e) { /* ignore parse error */ }
      }

      // 방법 2: 숨겨진 <select>
      var hiddenSelect = container.querySelector("select");
      if (hiddenSelect) {
        var options = [];
        hiddenSelect.querySelectorAll("option").forEach(function (opt) {
          if (opt.value) {
            options.push({ label: opt.textContent, value: opt.value });
          }
        });
        if (options.length > 0) {
          return Select._buildDropdown(container, options);
        }
      }

      return null;
    },

    _buildDropdown: function (container, options) {
      var dropdown = createEl("div", "select-digitek-dropdown");
      dropdown.style.display = "none";

      options.forEach(function (opt) {
        var btn = createEl("button", "select-digitek-option", { type: "button" }, opt.label);
        btn.dataset.value = opt.value;
        dropdown.appendChild(btn);
      });

      container.appendChild(dropdown);
      return dropdown;
    },
  };


  /* ================================================================== */
  /*  TextEditor                                                         */
  /* ================================================================== */

  var TextEditor = {
    /** 에디터별 상태를 WeakMap으로 관리 */
    _states: typeof WeakMap !== "undefined" ? new WeakMap() : null,

    init: function () {
      // 에디터 초기화
      document.querySelectorAll(".text-editor-digitek").forEach(function (editor) {
        TextEditor._initEditor(editor);
      });
    },

    _getState: function (editor) {
      if (!TextEditor._states) return {};
      return TextEditor._states.get(editor) || {};
    },

    _setState: function (editor, state) {
      if (!TextEditor._states) return;
      var prev = TextEditor._states.get(editor) || {};
      TextEditor._states.set(editor, Object.assign(prev, state));
    },

    _initEditor: function (editor) {
      if (editor.dataset.initialized) return;
      editor.dataset.initialized = "true";
      var contentEl = editor.querySelector(".text-editor-digitek-contents");
      if (!contentEl) return;

      TextEditor._setState(editor, {
        savedSelection: null,
        savedSelectionText: "",
        textSize: "body",
        textColor: "#111111",
        textAlign: "left",
        openDropdown: null,
      });

      // 툴바 버튼 mousedown: 선택 유지
      editor.querySelectorAll(
        ".text-editor-digitek-icon-btn, .text-editor-digitek-size-btn, " +
        ".text-editor-digitek-chevron-btn, .text-editor-digitek-bar-btn, " +
        ".text-editor-digitek-color-btn"
      ).forEach(function (btn) {
        btn.addEventListener("mousedown", function (e) {
          e.preventDefault();
          TextEditor._saveSelection(editor);
        });
      });

      // 아이콘 버튼 클릭
      editor.querySelectorAll(".text-editor-digitek-icon-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          TextEditor._handleIconBtn(editor, btn);
        });
      });

      // 텍스트 크기 버튼
      var sizeBtn = editor.querySelector(".text-editor-digitek-size-btn");
      if (sizeBtn) {
        sizeBtn.addEventListener("click", function () {
          var state = TextEditor._getState(editor);
          var tagMap = { body: "p", subheading: "h3", heading: "h2", title: "h1" };
          TextEditor._exec(editor, "formatBlock", "<" + (tagMap[state.textSize] || "p") + ">");
        });
      }

      // 크기 쉐브론 (드롭다운 토글)
      var sizeSplitBtn = editor.querySelector(".text-editor-digitek-split-btn");
      if (sizeSplitBtn) {
        var sizeChevron = sizeSplitBtn.querySelector(".text-editor-digitek-chevron-btn");
        if (sizeChevron) {
          sizeChevron.addEventListener("click", function () {
            TextEditor._toggleDropdown(editor, "size");
          });
        }
      }

      // 정렬 버튼
      var alignBtn = editor.querySelector(".text-editor-digitek-bar-btn");
      if (alignBtn) {
        alignBtn.addEventListener("click", function () {
          TextEditor._toggleDropdown(editor, "align");
        });
      }

      // 색상 쉐브론
      var splitBtns = editor.querySelectorAll(".text-editor-digitek-split-btn");
      if (splitBtns.length >= 2) {
        var colorSplit = splitBtns[1];
        var colorChevron = colorSplit.querySelector(".text-editor-digitek-chevron-btn");
        if (colorChevron) {
          colorChevron.addEventListener("click", function () {
            TextEditor._toggleDropdown(editor, "color");
          });
        }
        var colorBtn = colorSplit.querySelector(".text-editor-digitek-color-btn");
        if (colorBtn) {
          colorBtn.addEventListener("click", function () {
            var state = TextEditor._getState(editor);
            TextEditor._exec(editor, "foreColor", state.textColor || "#111111");
          });
        }
      }

      // 키보드 단축키
      contentEl.addEventListener("keydown", function (e) {
        TextEditor._handleKeyDown(editor, e);
      });

      // 붙여넣기 정제
      contentEl.addEventListener("paste", function (e) {
        TextEditor._handlePaste(editor, e);
      });

      // 선택 변경 시 서식 상태 업데이트
      document.addEventListener("selectionchange", function () {
        var sel = window.getSelection();
        if (sel && contentEl.contains(sel.anchorNode)) {
          TextEditor._updateFormatState(editor);
          if (sel.rangeCount > 0 && sel.toString().length > 0) {
            TextEditor._saveSelection(editor);
          }
        }
      });

      // 이미지 클릭 리사이즈
      contentEl.addEventListener("click", function (e) {
        if (e.target.tagName === "IMG") {
          TextEditor._showImageResize(editor, e.target);
        } else {
          TextEditor._hideImageResize(editor);
        }
      });

      // 외부 클릭으로 드롭다운/팝오버 닫기
      document.addEventListener("mousedown", function (e) {
        var state = TextEditor._getState(editor);
        if (state.openDropdown && !editor.contains(e.target)) {
          TextEditor._closeDropdowns(editor);
        }
      });
    },

    /* ── 선택 영역 관리 ── */

    _saveSelection: function (editor) {
      var sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        TextEditor._setState(editor, {
          savedSelection: sel.getRangeAt(0).cloneRange(),
          savedSelectionText: sel.toString(),
        });
      }
    },

    _restoreSelection: function (editor) {
      var state = TextEditor._getState(editor);
      if (state.savedSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(state.savedSelection);
      }
    },

    /* ── execCommand 래퍼 ── */

    _exec: function (editor, cmd, value) {
      var contentEl = editor.querySelector(".text-editor-digitek-contents");
      var state = TextEditor._getState(editor);
      if (state.savedSelection) {
        contentEl.focus();
        TextEditor._restoreSelection(editor);
      } else {
        contentEl.focus();
      }
      document.execCommand(cmd, false, value);
      TextEditor._updateFormatState(editor);
    },

    /* ── 서식 상태 업데이트 ── */

    _updateFormatState: function (editor) {
      var btns = {
        "굵게": "bold",
        "기울임": "italic",
        "밑줄": "underline",
        "취소선": "strikeThrough",
      };

      for (var title in btns) {
        if (!btns.hasOwnProperty(title)) continue;
        var btn = editor.querySelector('.text-editor-digitek-icon-btn[title*="' + title + '"]');
        if (btn) {
          var active = false;
          try { active = document.queryCommandState(btns[title]); } catch (e) { /* ignore */ }
          btn.classList.toggle("text-editor-digitek-icon-btn-active", active);
        }
      }
    },

    /* ── 아이콘 버튼 핸들러 ── */

    _handleIconBtn: function (editor, btn) {
      var title = btn.getAttribute("title") || "";

      var cmdMap = {
        "실행 취소": "undo",
        "다시 실행": "redo",
        "굵게": "bold",
        "기울임": "italic",
        "밑줄": "underline",
        "취소선": "strikeThrough",
        "서식 지우기": "removeFormat",
        "글머리 기호": "insertUnorderedList",
        "번호 매기기": "insertOrderedList",
        "구분선": "insertHorizontalRule",
        "코드 블록": null, // 특수 처리
        "인라인 코드": null,
        "링크": null,
        "이미지": null,
      };

      for (var key in cmdMap) {
        if (!cmdMap.hasOwnProperty(key)) continue;
        if (title.indexOf(key) !== -1) {
          if (key === "코드 블록") {
            TextEditor._exec(editor, "formatBlock", "<pre>");
            return;
          }
          if (key === "인라인 코드") {
            TextEditor._toggleInlineCode(editor);
            return;
          }
          if (key === "링크") {
            TextEditor._toggleLinkPopover(editor, btn);
            return;
          }
          if (key === "이미지") {
            TextEditor._triggerImageUpload(editor);
            return;
          }
          if (cmdMap[key]) {
            TextEditor._exec(editor, cmdMap[key]);
            return;
          }
        }
      }
    },

    /* ── 키보드 단축키 ── */

    _handleKeyDown: function (editor, e) {
      var isMod = e.metaKey || e.ctrlKey;

      if (isMod) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            TextEditor._exec(editor, "bold");
            break;
          case "i":
            e.preventDefault();
            TextEditor._exec(editor, "italic");
            break;
          case "u":
            e.preventDefault();
            TextEditor._exec(editor, "underline");
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              TextEditor._exec(editor, "redo");
            } else {
              TextEditor._exec(editor, "undo");
            }
            break;
          case "y":
            e.preventDefault();
            TextEditor._exec(editor, "redo");
            break;
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          TextEditor._exec(editor, "outdent");
        } else {
          TextEditor._exec(editor, "indent");
        }
      }
    },

    /* ── 인라인 코드 토글 ── */

    _toggleInlineCode: function (editor) {
      var contentEl = editor.querySelector(".text-editor-digitek-contents");
      var sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      var range = sel.getRangeAt(0);
      var selectedText = range.toString();
      if (!selectedText) { contentEl.focus(); return; }

      var node = range.commonAncestorContainer;
      var parentCode = null;
      while (node && node !== contentEl) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "CODE") {
          parentCode = node;
          break;
        }
        node = node.parentNode;
      }

      if (parentCode) {
        var textNode = document.createTextNode(parentCode.textContent || "");
        parentCode.replaceWith(textNode);
        var newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        sel.removeAllRanges();
        sel.addRange(newRange);
      } else {
        var code = document.createElement("code");
        range.surroundContents(code);
        var newRange = document.createRange();
        newRange.selectNodeContents(code);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
      contentEl.focus();
    },

    /* ── 붙여넣기 정제 ── */

    _handlePaste: function (editor, e) {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      var html = e.clipboardData.getData("text/html");
      var allowedTags = ["P", "BR", "B", "STRONG", "I", "EM", "U", "S", "STRIKE", "A", "UL", "OL", "LI", "H1", "H2", "H3", "DIV", "SPAN"];

      if (html) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        var cleanHtml = function (node) {
          if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
          if (node.nodeType !== Node.ELEMENT_NODE) return "";
          var el = node;
          var tagName = el.tagName;
          var children = "";
          el.childNodes.forEach(function (child) { children += cleanHtml(child); });

          if (allowedTags.indexOf(tagName) !== -1) {
            if (tagName === "A") {
              var href = el.getAttribute("href");
              return href ? '<a href="' + href + '">' + children + '</a>' : children;
            }
            if (tagName === "SPAN" || tagName === "DIV") return children;
            return "<" + tagName.toLowerCase() + ">" + children + "</" + tagName.toLowerCase() + ">";
          }
          return children;
        };

        var cleaned = cleanHtml(tempDiv);
        document.execCommand("insertHTML", false, cleaned);
      } else {
        var lines = text.split("\n");
        var htmlText = lines.map(function (line) { return line || "<br>"; }).join("<br>");
        document.execCommand("insertHTML", false, htmlText);
      }
    },

    /* ── 드롭다운 (크기/정렬/색상) ── */

    _toggleDropdown: function (editor, type) {
      var state = TextEditor._getState(editor);
      var wasOpen = state.openDropdown === type;

      TextEditor._closeDropdowns(editor);
      if (wasOpen) return;

      TextEditor._setState(editor, { openDropdown: type });

      // 쉐브론 버튼 활성 및 aria-expanded 업데이트
      var splitBtns = editor.querySelectorAll(".text-editor-digitek-split-btn");
      if (type === "size") {
        if (splitBtns[0]) {
          var chevBtn = splitBtns[0].querySelector(".text-editor-digitek-chevron-btn");
          if (chevBtn) {
            chevBtn.classList.add("text-editor-digitek-chevron-btn-open");
            chevBtn.setAttribute("aria-expanded", "true");
          }
        }
      } else if (type === "align") {
        var barBtn = editor.querySelector(".text-editor-digitek-bar-btn");
        if (barBtn) {
          barBtn.classList.add("text-editor-digitek-bar-btn-open");
          barBtn.setAttribute("aria-expanded", "true");
        }
      } else if (type === "color") {
        if (splitBtns[1]) {
          var chevBtn2 = splitBtns[1].querySelector(".text-editor-digitek-chevron-btn");
          if (chevBtn2) {
            chevBtn2.classList.add("text-editor-digitek-chevron-btn-open");
            chevBtn2.setAttribute("aria-expanded", "true");
          }
        }
      }

      // 드롭다운 DOM 생성/표시
      TextEditor._showDropdown(editor, type);
    },

    _showDropdown: function (editor, type) {
      var containers = editor.querySelectorAll(".text-editor-digitek-dropdown-container");
      var container = null;

      if (type === "size") container = containers[0];
      else if (type === "align") container = containers[1];
      else if (type === "color") container = containers[2];

      if (!container) return;

      // 기존 드롭다운 제거
      var existing = container.querySelector(".text-editor-digitek-dropdown");
      if (existing) existing.remove();

      var dropdown = document.createElement("div");
      dropdown.className = "text-editor-digitek-dropdown text-editor-digitek-" + type + "-dropdown";

      if (type === "size") {
        var sizes = [
          { value: "body", label: "본문", cls: "text-editor-digitek-size-body", tag: "p" },
          { value: "subheading", label: "부머리말", cls: "text-editor-digitek-size-subheading", tag: "h3" },
          { value: "heading", label: "머리말", cls: "text-editor-digitek-size-heading", tag: "h2" },
          { value: "title", label: "제목", cls: "text-editor-digitek-size-title", tag: "h1" },
        ];
        var state = TextEditor._getState(editor);
        sizes.forEach(function (s) {
          var btn = createEl("button", "text-editor-digitek-size-item " + s.cls +
            (state.textSize === s.value ? " text-editor-digitek-selected" : ""),
            { type: "button" }, s.label);
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            TextEditor._setState(editor, { textSize: s.value });
            // 사이즈 버튼 라벨 업데이트
            var sizeBtn = editor.querySelector(".text-editor-digitek-size-btn");
            if (sizeBtn) sizeBtn.textContent = s.label;
            TextEditor._closeDropdowns(editor);
            TextEditor._exec(editor, "formatBlock", "<" + s.tag + ">");
          });
          dropdown.appendChild(btn);
        });
      } else if (type === "align") {
        var aligns = [
          { value: "left", label: "왼쪽", cmd: "justifyLeft" },
          { value: "center", label: "중앙", cmd: "justifyCenter" },
          { value: "right", label: "오른쪽", cmd: "justifyRight" },
          { value: "justify", label: "맞춤", cmd: "justifyFull" },
        ];
        var state = TextEditor._getState(editor);
        aligns.forEach(function (a) {
          var btn = createEl("button", "text-editor-digitek-align-item" +
            (state.textAlign === a.value ? " text-editor-digitek-selected" : ""),
            { type: "button" });
          var iconMap = {
            left: "dicon-align-left",
            center: "dicon-align-center",
            right: "dicon-align-right",
            justify: "dicon-align-justify",
          };
          btn.innerHTML = '<i class="dicon ' + iconMap[a.value] + ' icon-digitek-20"></i><span>' + a.label + '</span>';
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            TextEditor._setState(editor, { textAlign: a.value });
            TextEditor._closeDropdowns(editor);
            TextEditor._exec(editor, a.cmd);
          });
          dropdown.appendChild(btn);
        });
      } else if (type === "color") {
        var colors = ["#111111", "#DC0000", "#087FF7", "#F09436", "#29C23B", "#767676"];
        var state = TextEditor._getState(editor);
        var colorList = createEl("div", "text-editor-digitek-color-list");
        colors.forEach(function (c) {
          var btn = createEl("button", "text-editor-digitek-color-swatch", { type: "button" });
          var dot = createEl("span", "text-editor-digitek-color-dot");
          dot.style.backgroundColor = c;
          if (state.textColor === c) dot.classList.add("active");
          btn.appendChild(dot);
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            TextEditor._setState(editor, { textColor: c });
            // 색상 버튼 업데이트
            var colorIndicator = editor.querySelector(".text-editor-digitek-color-btn .text-editor-digitek-color-swatch");
            if (colorIndicator) colorIndicator.style.backgroundColor = c;
            TextEditor._closeDropdowns(editor);
            TextEditor._exec(editor, "foreColor", c);
          });
          colorList.appendChild(btn);
        });
        dropdown.appendChild(colorList);
      }

      container.appendChild(dropdown);
    },

    _closeDropdowns: function (editor) {
      TextEditor._setState(editor, { openDropdown: null });
      editor.querySelectorAll(".text-editor-digitek-dropdown").forEach(function (d) { d.remove(); });
      editor.querySelectorAll(".text-editor-digitek-chevron-btn-open").forEach(function (b) {
        b.classList.remove("text-editor-digitek-chevron-btn-open");
        b.setAttribute("aria-expanded", "false");
      });
      editor.querySelectorAll(".text-editor-digitek-bar-btn-open").forEach(function (b) {
        b.classList.remove("text-editor-digitek-bar-btn-open");
        b.setAttribute("aria-expanded", "false");
      });
      // 링크 팝오버도 닫기
      editor.querySelectorAll(".text-editor-digitek-popover").forEach(function (p) { p.remove(); });
    },

    /* ── 링크 삽입 ── */

    _toggleLinkPopover: function (editor, btn) {
      var container = btn.closest(".text-editor-digitek-dropdown-container");
      if (!container) return;

      var existing = container.querySelector(".text-editor-digitek-popover");
      if (existing) {
        existing.remove();
        return;
      }

      TextEditor._closeDropdowns(editor);

      var popover = createEl("div", "text-editor-digitek-popover");
      var input = createEl("input", "text-editor-digitek-popover-input", {
        type: "text",
        placeholder: "https://...",
      });
      var confirmBtn = createEl("button", "text-editor-digitek-popover-btn", { type: "button" }, "확인");

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && input.value) {
          e.preventDefault();
          e.stopPropagation();
          TextEditor._insertLink(editor, input.value);
          popover.remove();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          popover.remove();
        }
      });

      confirmBtn.addEventListener("click", function () {
        if (input.value) {
          TextEditor._insertLink(editor, input.value);
          popover.remove();
        }
      });

      popover.appendChild(input);
      popover.appendChild(confirmBtn);
      container.appendChild(popover);

      setTimeout(function () { input.focus(); }, 50);
    },

    _insertLink: function (editor, url) {
      var safeUrl = /^(https?:|mailto:)/i.test(url) ? url : null;
      if (!safeUrl) return;

      var contentEl = editor.querySelector(".text-editor-digitek-contents");
      var state = TextEditor._getState(editor);

      if (state.savedSelection) {
        contentEl.focus();
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(state.savedSelection);
        document.execCommand("createLink", false, safeUrl);
        TextEditor._setState(editor, { savedSelection: null, savedSelectionText: "" });
        return;
      }

      if (state.savedSelectionText) {
        var text = state.savedSelectionText;
        var a = document.createElement("a");
        a.href = safeUrl;
        a.textContent = text;
        var tmp = document.createElement("div");
        tmp.appendChild(a);
        contentEl.innerHTML = contentEl.innerHTML.replace(text, tmp.innerHTML);
        TextEditor._setState(editor, { savedSelection: null, savedSelectionText: "" });
      }
    },

    /* ── 이미지 삽입 ── */

    _triggerImageUpload: function (editor) {
      var existing = editor.querySelector('input[type="file"][data-digitek-image]');
      if (existing) existing.remove();

      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";
      input.setAttribute("data-digitek-image", "true");

      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        var contentEl = editor.querySelector(".text-editor-digitek-contents");

        var reader = new FileReader();
        reader.onload = function () {
          contentEl.focus();
          TextEditor._restoreSelection(editor);
          var imgHtml = '<img src="' + reader.result + '" alt="' + file.name + '" style="max-width: 100%;" />';
          document.execCommand("insertHTML", false, imgHtml);
        };
        reader.readAsDataURL(file);
        input.remove();
      });

      editor.appendChild(input);
      input.click();
    },

    /* ── 이미지 리사이즈 ── */

    _showImageResize: function (editor, img) {
      TextEditor._hideImageResize(editor);

      var primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--digitek-primary").trim();
      var contentEl = editor.querySelector(".text-editor-digitek-contents");
      var contentRect = contentEl.getBoundingClientRect();
      var imgRect = img.getBoundingClientRect();

      var overlay = createEl("div", "text-editor-digitek-image-resize-overlay");
      overlay.style.cssText = "position:absolute;border:2px solid " + primaryColor + ";pointer-events:none;" +
        "left:" + (imgRect.left - contentRect.left + contentEl.scrollLeft) + "px;" +
        "top:" + (imgRect.top - contentRect.top + contentEl.scrollTop) + "px;" +
        "width:" + imgRect.width + "px;height:" + imgRect.height + "px;";

      var handle = createEl("div", "text-editor-digitek-resize-handle");
      handle.style.cssText = "position:absolute;right:-4px;bottom:-4px;width:10px;height:10px;" +
        "background:" + primaryColor + ";border-radius:2px;cursor:se-resize;pointer-events:all;";

      var startX, startW, startH;
      handle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();
        startX = e.clientX;
        startW = img.offsetWidth;
        startH = img.offsetHeight;
        var aspect = startH / startW;

        function onMove(ev) {
          var dx = ev.clientX - startX;
          var newW = Math.max(50, startW + dx);
          var newH = newW * aspect;
          img.style.width = newW + "px";
          img.style.height = newH + "px";
          // 오버레이 업데이트
          var newRect = img.getBoundingClientRect();
          overlay.style.width = newRect.width + "px";
          overlay.style.height = newRect.height + "px";
        }
        function onUp() {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });

      overlay.appendChild(handle);
      contentEl.style.position = "relative";
      contentEl.appendChild(overlay);

      TextEditor._setState(editor, { _resizeOverlay: overlay, _resizeImg: img });
    },

    _hideImageResize: function (editor) {
      var state = TextEditor._getState(editor);
      if (state._resizeOverlay) {
        state._resizeOverlay.remove();
        TextEditor._setState(editor, { _resizeOverlay: null, _resizeImg: null });
      }
    },
  };


  /* ================================================================== */
  /*  Locale (다국어 선택)                                                */
  /* ================================================================== */

  var Locale = {
    init: function () {
      // 버튼 클릭 → 드롭다운 열기/닫기
      delegateEvent("click", ".gnb-digitek-locale-btn", function (e, btn) {
        e.stopPropagation();
        var wrap = btn.closest(".gnb-digitek-locale-wrap");
        if (!wrap) return;
        wrap.classList.toggle("open");
        btn.setAttribute("aria-expanded", wrap.classList.contains("open") ? "true" : "false");
      });

      // 옵션 클릭 → 선택 반영
      delegateEvent("click", ".gnb-digitek-locale-option", function (e, option) {
        var wrap = option.closest(".gnb-digitek-locale-wrap");
        if (!wrap) return;

        // active 상태 변경
        wrap.querySelectorAll(".gnb-digitek-locale-option").forEach(function (opt) {
          opt.classList.remove("active");
        });
        option.classList.add("active");

        // 버튼 텍스트 업데이트
        var btn = wrap.querySelector(".gnb-digitek-locale-btn");
        if (btn) {
          var code = option.textContent.trim();
          // 아이콘 쉐브론 보존
          var chevron = btn.querySelector(".dicon");
          btn.textContent = code + " ";
          if (chevron) btn.appendChild(chevron);
          // 닫을 때 aria-expanded 갱신
          btn.setAttribute("aria-expanded", "false");
        }

        wrap.classList.remove("open");
        emit(wrap, "digitek:locale-change", { locale: option.textContent.trim() });
      });

      // 외부 클릭 닫기
      document.addEventListener("mousedown", function (e) {
        document.querySelectorAll(".gnb-digitek-locale-wrap.open").forEach(function (wrap) {
          if (!wrap.contains(e.target)) {
            wrap.classList.remove("open");
            var btn = wrap.querySelector(".gnb-digitek-locale-btn");
            if (btn) btn.setAttribute("aria-expanded", "false");
          }
        });
      });
    },
  };


  /* ================================================================== */
  /*  간트 차트 리사이저                                                   */
  /* ================================================================== */

  var GanttResizer = {
    init: function () {
      document.querySelectorAll(".digitek-gantt-resizer:not([data-initialized])").forEach(function (resizer) {
        resizer.setAttribute("data-initialized", "true");
        resizer.addEventListener("mousedown", function (e) {
          e.preventDefault();
          var container = resizer.closest(".digitek-gantt-container");
          if (!container) return;
          var tableWrap = container.querySelector(".digitek-gantt-table-wrap");
          if (!tableWrap) return;
          var startX = e.clientX;
          var startWidth = tableWrap.offsetWidth;

          function onMove(ev) {
            var containerWidth = container.clientWidth;
            var diff = ev.clientX - startX;
            var newWidth = Math.max(0, Math.min(startWidth + diff, containerWidth));
            tableWrap.style.width = newWidth + "px";
          }

          function onUp() {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
          }

          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        });
      });
    },
  };


  /* ================================================================== */
  /*  DraggableTable — 드래그앤드롭 행 순서 변경                            */
  /* ================================================================== */

  var DraggableTable = (function () {
    function initTable(tableBodyIdOrEl) {
      var tbody;
      if (typeof tableBodyIdOrEl === "string") {
        tbody = document.getElementById(tableBodyIdOrEl);
      } else {
        tbody = tableBodyIdOrEl;
      }
      if (!tbody) return;

      var dragSrc = null;

      tbody.querySelectorAll(".draggable-row:not([data-initialized])").forEach(function (row) {
        row.setAttribute("data-initialized", "true");
        row.addEventListener("dragstart", function (e) {
          dragSrc = this;
          e.dataTransfer.effectAllowed = "move";
          this.style.opacity = "0.5";
        });
        row.addEventListener("dragend", function () {
          this.style.opacity = "";
          tbody.querySelectorAll(".draggable-row").forEach(function (r) {
            r.classList.remove("drag-over");
          });
          tbody.querySelectorAll(".draggable-row").forEach(function (r, i) {
            r.setAttribute("data-order", i + 1);
            var orderCell = r.cells[1];
            if (orderCell && !isNaN(parseInt(orderCell.textContent.trim()))) {
              orderCell.textContent = i + 1;
            }
          });
        });
        row.addEventListener("dragover", function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          this.classList.add("drag-over");
        });
        row.addEventListener("dragleave", function () {
          this.classList.remove("drag-over");
        });
        row.addEventListener("drop", function (e) {
          e.preventDefault();
          if (dragSrc !== this) {
            var rows = Array.from(tbody.querySelectorAll(".draggable-row"));
            var srcIdx = rows.indexOf(dragSrc);
            var tgtIdx = rows.indexOf(this);
            if (srcIdx < tgtIdx) {
              tbody.insertBefore(dragSrc, this.nextSibling);
            } else {
              tbody.insertBefore(dragSrc, this);
            }
          }
        });
      });
    }

    function init() {
      document.querySelectorAll("[data-draggable-table]").forEach(function (el) {
        initTable(el);
      });
    }

    return { init: init, initTable: initTable };
  })();


  /* ================================================================== */
  /*  SearchList 페이지 초기화                                           */
  /* ================================================================== */

  var SearchList = {
    init: function () {
      /* 필터 토글 */
      delegateEvent('click', '[data-toggle="searchlist-filter"]', function (e, btn) {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var nowExpanded = !expanded;
        btn.setAttribute('aria-expanded', String(nowExpanded));
        var icon = btn.querySelector('.dicon');
        if (icon) {
          icon.classList.toggle('dicon-chevron-down', !nowExpanded);
          icon.classList.toggle('dicon-chevron-up', nowExpanded);
        }
        var area = btn.closest('.digitek-search-panel').querySelector('.digitek-search-filter-area');
        if (area) area.classList.toggle('show');
      });

      /* 구 객체 포함 체크박스 경고 토글 */
      delegateEvent('change', '#include-legacy', function (e, checkbox) {
        var warning = document.getElementById('include-legacy-warning');
        if (warning) warning.style.visibility = checkbox.checked ? 'visible' : 'hidden';
      });
    }
  };

  /* ================================================================== */
  /*  SearchSplit 페이지 초기화                                          */
  /* ================================================================== */

  var SearchSplit = {
    init: function () {
      /* 필터 토글 */
      delegateEvent('click', '[data-toggle="searchsplit-filter"]', function (e, btn) {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var nowExpanded = !expanded;
        btn.setAttribute('aria-expanded', String(nowExpanded));
        var icon = btn.querySelector('.dicon');
        if (icon) {
          icon.classList.toggle('dicon-chevron-down', !nowExpanded);
          icon.classList.toggle('dicon-chevron-up', nowExpanded);
        }
        var area = btn.closest('.digitek-split-search-panel').querySelector('.digitek-split-filter-area');
        if (area) area.classList.toggle('show');
      });

      /* 뷰 탭 토글 */
      delegateEvent('click', '.digitek-split-view-tab', function (e, tab) {
        tab.closest('.digitek-split-view-tabs').querySelectorAll('.digitek-split-view-tab').forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-pressed', 'true');
        var container = tab.closest('.digitek-split-body');
        if (!container) return;
        var isFullView = tab.textContent.trim() === '펼쳐서 보기';
        container.classList.toggle('digitek-split-body-fullview', isFullView);
      });

      /* 행 클릭 → 상세 패널 열기 */
      delegateEvent('click', '[data-detail-trigger]', function (e, row) {
        var body = row.closest('.digitek-split-body');
        if (!body) return;
        body.classList.add('digitek-split-body-detail-open');
        document.querySelectorAll('.digitek-split-table-row').forEach(function (r) { r.classList.remove('active'); });
        row.classList.add('active');
      });

      /* 상세 패널 닫기 */
      delegateEvent('click', '[data-action="close"]', function (e, btn) {
        var body = btn.closest('.digitek-split-body');
        if (body) {
          body.classList.remove('digitek-split-body-detail-open');
          body.classList.remove('digitek-split-body-fullview');
        }
      });

      /* 확대 버튼 → 전체 보기 */
      delegateEvent('click', '[data-action="expand"]', function (e, btn) {
        var panel = btn.closest('.digitek-split-detail');
        var body = btn.closest('.digitek-split-body');
        if (body) body.classList.add('digitek-split-body-fullview');
        if (panel) {
          var expandBtn = panel.querySelector('[data-action="expand"]');
          var shrinkBtn = panel.querySelector('[data-action="shrink"]');
          if (expandBtn) expandBtn.hidden = true;
          if (shrinkBtn) { shrinkBtn.hidden = false; shrinkBtn.focus(); }
        }
      });

      /* 축소 버튼 → 전체 보기 해제 + 팝업 */
      delegateEvent('click', '[data-action="shrink"]', function (e, btn) {
        var panel = btn.closest('.digitek-split-detail');
        var body = btn.closest('.digitek-split-body');
        if (body) body.classList.remove('digitek-split-body-fullview');
        if (panel) {
          var expandBtn = panel.querySelector('[data-action="expand"]');
          var shrinkBtn = panel.querySelector('[data-action="shrink"]');
          if (shrinkBtn) shrinkBtn.hidden = true;
          if (expandBtn) expandBtn.hidden = false;
        }
        SearchSplit._openDetailPopup('../popup/searchsplit-detail-popup.html');
      });

      /* 결과 헤더 아코디언 토글 */
      delegateEvent('click', '[data-toggle="searchsplit-results"]', function (e, btn) {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var nowExpanded = !expanded;
        btn.setAttribute('aria-expanded', String(nowExpanded));
        var card = btn.closest('.digitek-split-results-card');
        if (card) {
          card.querySelectorAll('.digitek-split-table-wrap, .digitek-split-pagination').forEach(function (el) {
            el.style.display = nowExpanded ? '' : 'none';
          });
        }
      });

      /* 검색 패널 접기/펼치기 핸들 */
      delegateEvent('click', '[data-toggle="searchsplit-search-panel"]', function (e, btn) {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var nowExpanded = !expanded;
        btn.setAttribute('aria-expanded', String(nowExpanded));
        var body = btn.closest('.digitek-split-body');
        if (body) body.classList.toggle('digitek-split-search-collapsed', !nowExpanded);
      });
    },

    _openDetailPopup: function (url, w, h) {
      w = w || 1000;
      h = h || 640;
      var left = Math.round((screen.width / 2) - (w / 2));
      var top  = Math.round((screen.height / 2) - (h / 2));
      window.open(url, 'searchsplit-detail',
        'width=' + w + ',height=' + h +
        ',left=' + left + ',top=' + top +
        ',scrollbars=yes,resizable=yes');
    }
  };

  /* ================================================================== */
  /*  DateSelect (날짜 선택)                                              */
  /* ================================================================== */

  var DateSelect = {
    _openCalendar: null,

    init: function () {
      // 트리거 클릭 → 캘린더 열기/닫기
      delegateEvent("click", ".date-select-digitek-trigger", function (e, trigger) {
        if (trigger.classList.contains("date-select-digitek-trigger-disabled")) return;

        var container = trigger.closest(".date-select-digitek");
        if (!container) return;

        var existingCalendar = container.querySelector(".date-select-digitek-calendar");
        if (existingCalendar) {
          DateSelect._close(container);
        } else {
          DateSelect._closeAll();
          DateSelect._open(container, trigger);
        }
      });

      // 이전/다음 달 버튼
      delegateEvent("click", ".date-select-digitek-nav-btn", function (e, btn) {
        e.stopPropagation();
        var calendar = btn.closest(".date-select-digitek-calendar");
        if (!calendar) return;
        var container = calendar.closest(".date-select-digitek");
        if (!container) return;

        var direction = btn.getAttribute("aria-label") === "이전 달" ? -1 : 1;
        var year = parseInt(calendar.dataset.year);
        var month = parseInt(calendar.dataset.month);

        month += direction;
        if (month < 0) { month = 11; year--; }
        if (month > 11) { month = 0; year++; }

        calendar.dataset.year = year;
        calendar.dataset.month = month;
        DateSelect._renderGrid(calendar, year, month, container);
      });

      // 날짜 선택
      delegateEvent("click", ".date-select-digitek-day", function (e, day) {
        if (day.classList.contains("date-select-digitek-day-disabled")) return;
        e.stopPropagation();

        var calendar = day.closest(".date-select-digitek-calendar");
        if (!calendar) return;
        var container = calendar.closest(".date-select-digitek");
        if (!container) return;

        var year = parseInt(calendar.dataset.year);
        var month = parseInt(calendar.dataset.month);
        var allDays = calendar.querySelectorAll(".date-select-digitek-day");
        var dayIndex = Array.from(allDays).indexOf(day);
        var dayNum = parseInt(day.textContent);

        if (day.classList.contains("date-select-digitek-day-other-month")) {
          // 첫 번째 현재 달 날짜 인덱스 파악
          var firstCurrentIdx = -1;
          allDays.forEach(function (d, i) {
            if (firstCurrentIdx === -1 && !d.classList.contains("date-select-digitek-day-other-month")) {
              firstCurrentIdx = i;
            }
          });
          if (dayIndex < firstCurrentIdx) {
            month--; if (month < 0) { month = 11; year--; }
          } else {
            month++; if (month > 11) { month = 0; year++; }
          }
        }

        var mm = month + 1;
        var dateStr = year + "-" + (mm < 10 ? "0" + mm : mm) + "-" + (dayNum < 10 ? "0" + dayNum : dayNum);

        // 트리거 텍스트 업데이트
        var trigger = container.querySelector(".date-select-digitek-trigger");
        var textEl = trigger && trigger.querySelector(".date-select-digitek-text, .date-select-digitek-placeholder");
        if (textEl) {
          textEl.textContent = dateStr;
          textEl.classList.remove("date-select-digitek-placeholder");
          if (!textEl.classList.contains("date-select-digitek-text")) {
            textEl.classList.add("date-select-digitek-text");
          }
        }

        // 숨겨진 입력 업데이트
        var hiddenInput = container.querySelector("input[type=hidden]");
        if (hiddenInput) hiddenInput.value = dateStr;

        DateSelect._close(container);
        emit(container, "digitek:date-select-change", { value: dateStr });
      });

      // 외부 클릭 → 닫기
      document.addEventListener("mousedown", function (e) {
        if (DateSelect._openCalendar) {
          var container = DateSelect._openCalendar.closest(".date-select-digitek");
          if (container && !container.contains(e.target)) {
            DateSelect._closeAll();
          }
        }
      });
    },

    _open: function (container, trigger) {
      var hiddenInput = container.querySelector("input[type=hidden]");
      var value = hiddenInput ? hiddenInput.value : "";
      var today = new Date();
      var year, month;

      if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        var parts = value.split("-");
        year = parseInt(parts[0]);
        month = parseInt(parts[1]) - 1;
      } else {
        year = today.getFullYear();
        month = today.getMonth();
      }

      var calendar = document.createElement("div");
      calendar.className = "date-select-digitek-calendar";
      calendar.dataset.year = year;
      calendar.dataset.month = month;

      // 헤더
      var header = createEl("div", "date-select-digitek-calendar-header");
      var prevBtn = createEl("button", "date-select-digitek-nav-btn", { type: "button" });
      prevBtn.setAttribute("aria-label", "이전 달");
      prevBtn.innerHTML = '<i class="dicon dicon-chevron-left icon-digitek-20" style="color:#111" aria-hidden="true"></i>';
      var titleEl = createEl("span", "date-select-digitek-calendar-title");
      var nextBtn = createEl("button", "date-select-digitek-nav-btn", { type: "button" });
      nextBtn.setAttribute("aria-label", "다음 달");
      nextBtn.innerHTML = '<i class="dicon dicon-chevron-right icon-digitek-20" style="color:#111" aria-hidden="true"></i>';
      header.appendChild(prevBtn);
      header.appendChild(titleEl);
      header.appendChild(nextBtn);
      calendar.appendChild(header);

      // 그리드
      var grid = createEl("div", "date-select-digitek-grid");
      var weekHeader = createEl("div", "date-select-digitek-week-header");
      ["일", "월", "화", "수", "목", "금", "토"].forEach(function (label, i) {
        var cls = "date-select-digitek-day-header" + (i === 0 || i === 6 ? " date-select-digitek-day-weekend" : "");
        weekHeader.appendChild(createEl("div", cls, null, label));
      });
      var monthWeeks = createEl("div", "date-select-digitek-month-weeks");
      grid.appendChild(weekHeader);
      grid.appendChild(monthWeeks);
      calendar.appendChild(grid);

      container.appendChild(calendar);
      DateSelect._renderGrid(calendar, year, month, container);

      trigger.classList.add("date-select-digitek-trigger-focused");
      DateSelect._openCalendar = calendar;
    },

    _renderGrid: function (calendar, year, month, container) {
      var titleEl = calendar.querySelector(".date-select-digitek-calendar-title");
      if (titleEl) titleEl.textContent = year + ". " + (month + 1);

      var hiddenInput = container.querySelector("input[type=hidden]");
      var selectedValue = hiddenInput ? hiddenInput.value : "";
      var selYear = null, selMonth = null, selDay = null;
      if (selectedValue && /^\d{4}-\d{2}-\d{2}$/.test(selectedValue)) {
        var parts = selectedValue.split("-");
        selYear = parseInt(parts[0]);
        selMonth = parseInt(parts[1]) - 1;
        selDay = parseInt(parts[2]);
      }

      var monthWeeks = calendar.querySelector(".date-select-digitek-month-weeks");
      if (!monthWeeks) return;
      monthWeeks.innerHTML = "";

      var firstDay = new Date(year, month, 1).getDay();
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var daysInPrev = new Date(year, month, 0).getDate();

      var days = [];
      for (var i = firstDay - 1; i >= 0; i--) {
        days.push({ day: daysInPrev - i, prev: true });
      }
      for (var d = 1; d <= daysInMonth; d++) {
        days.push({ day: d });
      }
      var remaining = (7 - (days.length % 7)) % 7;
      for (var n = 1; n <= remaining; n++) {
        days.push({ day: n, next: true });
      }

      for (var w = 0; w < days.length; w += 7) {
        var row = createEl("div", "date-select-digitek-week-row");
        for (var col = 0; col < 7 && (w + col) < days.length; col++) {
          var info = days[w + col];
          var cls = "date-select-digitek-day";
          if (col === 0 || col === 6) cls += " date-select-digitek-day-weekend";
          if (info.prev || info.next) cls += " date-select-digitek-day-other-month";

          var dy = year, dm = month;
          if (info.prev) { dm--; if (dm < 0) { dm = 11; dy--; } }
          if (info.next) { dm++; if (dm > 11) { dm = 0; dy++; } }

          if (selYear === dy && selMonth === dm && selDay === info.day) {
            cls += " date-select-digitek-day-selected";
          }

          var btn = createEl("button", cls, { type: "button" }, String(info.day));
          if (selYear === dy && selMonth === dm && selDay === info.day) {
            btn.setAttribute("aria-selected", "true");
          }
          row.appendChild(btn);
        }
        monthWeeks.appendChild(row);
      }
    },

    _close: function (container) {
      var calendar = container.querySelector(".date-select-digitek-calendar");
      if (calendar) calendar.remove();
      var trigger = container.querySelector(".date-select-digitek-trigger");
      if (trigger) trigger.classList.remove("date-select-digitek-trigger-focused");
      if (DateSelect._openCalendar && !document.body.contains(DateSelect._openCalendar)) {
        DateSelect._openCalendar = null;
      }
    },

    _closeAll: function () {
      document.querySelectorAll(".date-select-digitek-calendar").forEach(function (cal) {
        var container = cal.closest(".date-select-digitek");
        if (container) DateSelect._close(container);
      });
      DateSelect._openCalendar = null;
    },
  };


  /* ================================================================== */
  /*  초기화 & 공개 API                                                   */
  /* ================================================================== */

  // Turbo Frame 이동 후 사이드바 active 상태를 현재 URL 기반으로 업데이트
  function updateSidebarActive() {
    var path = window.location.pathname;

    // 기존 active 클래스 전부 제거 + 서브메뉴 상태 초기화
    document.querySelectorAll(
      ".sidebar-digitek-menu-item, .sidebar-digitek-submenu-item, .sidebar-digitek-sub-submenu-item"
    ).forEach(function (link) {
      link.classList.remove("sidebar-digitek-active", "sidebar-digitek-sub-active");
      link.classList.remove("sidebar-digitek-parent-open");
      if (link.hasAttribute("aria-expanded")) {
        link.setAttribute("aria-expanded", "false");
      }
    });

    // 열려 있는 서브메뉴/서브-서브메뉴 maxHeight 초기화
    document.querySelectorAll(
      ".sidebar-digitek-submenu, .sidebar-digitek-sub-submenu"
    ).forEach(function (submenu) {
      submenu.style.maxHeight = "0";
    });

    // chevron 닫기
    document.querySelectorAll(".sidebar-digitek-chevron").forEach(function (chev) {
      chev.classList.remove("sidebar-digitek-chevron-open");
    });

    // 현재 경로와 일치하는 링크 찾기 (href="#" 인 부모 메뉴는 매칭 안 됨)
    var matched = document.querySelector('.sidebar-digitek a[href="' + path + '"]');
    if (!matched) return;

    if (matched.classList.contains("sidebar-digitek-menu-item")) {
      // 1레벨 메뉴
      matched.classList.add("sidebar-digitek-active");

    } else if (matched.classList.contains("sidebar-digitek-submenu-item")) {
      // 2레벨 서브메뉴 — active 클래스 + 부모 submenu maxHeight 열기
      matched.classList.add("sidebar-digitek-active");
      var submenu = matched.closest(".sidebar-digitek-submenu");
      if (submenu) {
        var count = submenu.querySelectorAll(":scope > .nav-item").length;
        submenu.style.maxHeight = (count * getSidebarItemH()) + "px";
        var parentItem = submenu.previousElementSibling;
        if (parentItem) {
          parentItem.setAttribute("aria-expanded", "true");
          parentItem.classList.add("sidebar-digitek-parent-open");
          var chev = parentItem.querySelector(".sidebar-digitek-chevron");
          if (chev) chev.classList.add("sidebar-digitek-chevron-open");
        }
      }

    } else if (matched.classList.contains("sidebar-digitek-sub-submenu-item")) {
      // 3레벨 서브-서브메뉴 — sidebar-digitek-sub-active 사용 (클릭 핸들러와 동일)
      matched.classList.add("sidebar-digitek-sub-active");
      var subSubmenu = matched.closest(".sidebar-digitek-sub-submenu");
      if (subSubmenu) {
        var count3 = subSubmenu.querySelectorAll(":scope > .nav-item").length;
        subSubmenu.style.maxHeight = (count3 * getSidebarItemH()) + "px";
        var parentSubmenuItem = subSubmenu.previousElementSibling;
        if (parentSubmenuItem) {
          parentSubmenuItem.setAttribute("aria-expanded", "true");
          var chev2 = parentSubmenuItem.querySelector(".sidebar-digitek-chevron");
          if (chev2) chev2.classList.add("sidebar-digitek-chevron-open");
        }
        // 부모 submenu도 열기
        var parentSubmenu = subSubmenu.closest(".sidebar-digitek-submenu");
        if (parentSubmenu) {
          Sidebar._recalcParentHeight(null, parentSubmenu);
          var grandParentItem = parentSubmenu.previousElementSibling;
          if (grandParentItem) {
            grandParentItem.setAttribute("aria-expanded", "true");
            grandParentItem.classList.add("sidebar-digitek-parent-open");
            var chev3 = grandParentItem.querySelector(".sidebar-digitek-chevron");
            if (chev3) chev3.classList.add("sidebar-digitek-chevron-open");
          }
        }
      }
    }
  }

  // 컨텐츠 영역 컴포넌트만 재초기화 (turbo-frame 교체 후 호출)
  // delegateEvent 기반 컴포넌트는 재초기화 불필요:
  //   Accordion, TabButton, FileUpload (document 위임)
  //   SearchList, SearchSplit (내부에서 delegateEvent 전용으로 구현)
  //   GNBSearch (GNB 영역은 프레임 교체 대상이 아님)
  //   Locale, Sidebar (초기화 1회로 충분)
  function initContent() {
    Select.init();
    DateSelect.init();
    TextEditor.init();
    GanttResizer.init();
    DraggableTable.init();
  }

  function initAll() {
    Sidebar.init();     // 레이아웃 전용 — DOMContentLoaded 시만 실행
    Accordion.init();
    TabButton.init();
    FileUpload.init();
    GNBSearch.init();
    Select.init();
    DateSelect.init();
    TextEditor.init();
    Locale.init();
    GanttResizer.init();
    DraggableTable.init();
    SearchList.init();
    SearchSplit.init();
  }

  // Turbo Frame 교체 후: main-content 프레임에만 반응
  document.addEventListener("turbo:frame-load", function (e) {
    if (e.target.id !== "main-content") return;
    initContent();
    updateSidebarActive();
  });

  // Turbo Drive 전체 페이지 전환 시 폴백 초기화
  document.addEventListener("turbo:load", function () {
    initAll();
  });

  // DOMContentLoaded 자동 초기화 (전체)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // window.Digitek 네임스페이스 노출
  window.Digitek = {
    /** 모듈별 접근 */
    Accordion: Accordion,
    TabButton: TabButton,
    Sidebar: Sidebar,
    FileUpload: FileUpload,
    GNBSearch: GNBSearch,
    Select: Select,
    DateSelect: DateSelect,
    TextEditor: TextEditor,
    Locale: Locale,
    GanttResizer: GanttResizer,
    DraggableTable: DraggableTable,
    SearchList: SearchList,
    SearchSplit: SearchSplit,
    initContent: initContent,
    updateSidebarActive: updateSidebarActive,
  };

})();
