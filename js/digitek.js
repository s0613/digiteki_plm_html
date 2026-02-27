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

  var sidebarItemH = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--sidebar-item-height")
  ) || 48;

  var Sidebar = {
    init: function () {
      // 토글 버튼 (접기/펼치기) — 사이드바 내부 또는 GNB 헤더에서 동작
      delegateEvent("click", ".sidebar-toggle-btn", function (e, btn) {
        var nav = btn.closest(".sidebar-digitek");
        if (!nav) {
          // GNB 헤더의 햄버거 버튼 → 레이아웃 내 사이드바 찾기
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
            submenu.style.maxHeight = (count * sidebarItemH) + "px";
            item.setAttribute("aria-expanded", "true");
            var chev = item.querySelector(".sidebar-digitek-chevron");
            if (chev) chev.classList.add("sidebar-digitek-chevron-open");
            item.classList.add("sidebar-digitek-active");
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
            subSubmenu.style.maxHeight = (count * sidebarItemH) + "px";
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
        // 메뉴 아이템 축소 클래스
        nav.querySelectorAll(".sidebar-digitek-menu-item").forEach(function (item) {
          item.classList.add("sidebar-digitek-menu-item-collapsed");
        });
        // 로고 전환은 CSS가 처리 (.sidebar-logo-full / .sidebar-logo-collapsed)
      } else {
        nav.classList.remove("sidebar-digitek-collapsed");
        nav.classList.add("sidebar-digitek-expanded");
        nav.querySelectorAll(".sidebar-digitek-menu-item").forEach(function (item) {
          item.classList.remove("sidebar-digitek-menu-item-collapsed");
        });
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
      submenu.style.maxHeight = (count * sidebarItemH) + "px";
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
      delegateEvent("click", ".request-digitek-file-card-remove", function (e, btn) {
        e.stopPropagation();
        var card = btn.closest(".request-digitek-file-card");
        if (card) {
          var name = card.querySelector(".request-digitek-file-card-name");
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
      document.addEventListener("mousedown", function (e) {
        if (Select._openSelect && !Select._openSelect.contains(e.target)) {
          Select._closeAll();
        }
      });
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
          // 정렬 아이콘 SVG
          var svgMap = {
            left: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 3.75h8.75V5H7.5V3.75zm0 3.75h6.25v1.25H7.5V7.5zm0 3.75h8.75v1.25H7.5v-1.25zm0 3.75h6.25v1.25H7.5V15zM3.75 2.5H5v15H3.75v-15z" fill="#111"/></svg>',
            center: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 3.75h15V5h-15V3.75zm2.5 3.75h10v1.25H5V7.5zm-2.5 3.75h15v1.25h-15v-1.25zm2.5 3.75h10v1.25H5V15z" fill="#111"/></svg>',
            right: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.75 3.75h8.75V5H3.75V3.75zm2.5 3.75h6.25v1.25H6.25V7.5zm-2.5 3.75h8.75v1.25H3.75v-1.25zm2.5 3.75h6.25v1.25H6.25V15zM15 2.5h1.25v15H15v-15z" fill="#111"/></svg>',
            justify: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 3.75h15V5h-15V3.75zm0 3.75h15v1.25h-15V7.5zm0 3.75h15v1.25h-15v-1.25zm0 3.75h15v1.25h-15V15z" fill="#111"/></svg>',
          };
          btn.innerHTML = (svgMap[a.value] || "") + "<span>" + a.label + "</span>";
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
          var checkmark = state.textColor === c
            ? '<path d="M6.5 10L8.834 12.5 13.5 7.5" stroke="white" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
            : '';
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="' + c + '"/>' + checkmark + '</svg>';
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            TextEditor._setState(editor, { textColor: c });
            // 색상 버튼 업데이트
            var colorBtnSvg = editor.querySelector(".text-editor-digitek-color-btn svg circle");
            if (colorBtnSvg) colorBtnSvg.setAttribute("fill", c);
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
      var contentEl = editor.querySelector(".text-editor-digitek-contents");
      var state = TextEditor._getState(editor);

      if (state.savedSelection) {
        contentEl.focus();
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(state.savedSelection);
        document.execCommand("createLink", false, url);
        TextEditor._setState(editor, { savedSelection: null, savedSelectionText: "" });
        return;
      }

      if (state.savedSelectionText) {
        var text = state.savedSelectionText;
        var html = contentEl.innerHTML;
        var linkHtml = '<a href="' + url + '">' + text + '</a>';
        contentEl.innerHTML = html.replace(text, linkHtml);
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
          // SVG 쉐브론 보존
          var svg = btn.querySelector("svg");
          btn.textContent = code + " ";
          if (svg) btn.appendChild(svg);
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
      document.querySelectorAll(".pms-digitek-gantt-resizer").forEach(function (resizer) {
        resizer.addEventListener("mousedown", function (e) {
          e.preventDefault();
          var container = resizer.closest(".pms-digitek-gantt-container");
          if (!container) return;
          var tableWrap = container.querySelector(".pms-digitek-gantt-table-wrap");
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
        tbody = document.getElementById(tableBodyIdOrEl || "draggableTableBody");
      } else {
        tbody = tableBodyIdOrEl;
      }
      if (!tbody) return;

      var dragSrc = null;

      tbody.querySelectorAll(".draggable-row").forEach(function (row) {
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
  /*  SidebarLoader — 사이드바 동적 로드                                   */
  /* ================================================================== */

  var SidebarLoader = (function () {
    var SIDEBAR_PATH = "components/navigation/sidebar-full.html";

    function resolvePath() {
      var parts = window.location.pathname.split("/").filter(Boolean);
      var prefix = "";
      if (parts.indexOf("pages") !== -1) {
        prefix = "../../";
      }
      return prefix + SIDEBAR_PATH;
    }

    function init() {
      var placeholder = document.querySelector("[data-sidebar]");
      if (!placeholder) return;
      var path = resolvePath();
      fetch(path)
        .then(function (resp) {
          if (!resp.ok) throw new Error("sidebar load failed");
          return resp.text();
        })
        .then(function (html) {
          placeholder.outerHTML = html;
          Sidebar.init();
        })
        .catch(function (err) {
          console.warn("SidebarLoader:", err.message);
        });
    }

    return { init: init };
  })();

  /* ================================================================== */
  /*  초기화 & 공개 API                                                   */
  /* ================================================================== */

  function initAll() {
    SidebarLoader.init();
    Accordion.init();
    TabButton.init();
    Sidebar.init();
    FileUpload.init();
    GNBSearch.init();
    Select.init();
    TextEditor.init();
    Locale.init();
    GanttResizer.init();
    DraggableTable.init();
  }

  // DOMContentLoaded 자동 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // window.Digitek 네임스페이스 노출
  window.Digitek = {
    /** 수동 재초기화 (동적으로 HTML을 삽입한 뒤 호출) */
    reinit: function () {
      TextEditor.init(); // TextEditor만 재초기화 (이벤트 위임이 아닌 직접 바인딩)
    },

    /** 모듈별 접근 */
    Accordion: Accordion,
    TabButton: TabButton,
    Sidebar: Sidebar,
    FileUpload: FileUpload,
    GNBSearch: GNBSearch,
    Select: Select,
    TextEditor: TextEditor,
    Locale: Locale,
    GanttResizer: GanttResizer,
    DraggableTable: DraggableTable,
    SidebarLoader: SidebarLoader,
  };

})();
