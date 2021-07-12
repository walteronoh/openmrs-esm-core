import { renderExtension } from "@openmrs/esm-extensions";
import { createGlobalStore } from "@openmrs/esm-state";

interface ModalInstance {
  container?: HTMLElement;
  state: "NEW" | "MOUNTED" | "TO_BE_DELETED";
  onClose: () => void;
  cleanup?: Function;
  extensionId: string;
  props: Record<string, any>;
}

interface ModalState {
  modalStack: Array<ModalInstance>;
}

const modalStore = createGlobalStore<ModalState>("globalModalState", {
  modalStack: [],
});

function htmlToElement(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstChild as ChildNode;
}

function createModalFrame() {
  const closeButton = htmlToElement(
    `
  <button
    class="bx--modal-close"
    type="button">
    <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>close</title><polygon class="cls-1" points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4"/><rect class="cls-2" width="32" height="32"/></svg>
  </button>`.trim()
  ) as HTMLButtonElement;

  closeButton.addEventListener("click", () => closeHighestInstance());
  const outer = document.createElement("div");
  outer.className = "bx--modal-container";
  const contentContainer = document.createElement("div");

  outer.append(closeButton);
  outer.append(contentContainer);

  return { outer, contentContainer };
}

export function renderModals(modalContainer: HTMLElement | null) {
  if (modalContainer) {
    modalStore.subscribe(({ modalStack }: ModalState) => {
      if (modalStack.length) {
        // spin up the container if it was hidden previously
        if (!modalContainer.style.visibility) {
          addEventListener("keydown", handleEscKey);
          modalContainer.style.visibility = "unset";
        }

        modalStack.forEach((instance, index) => {
          switch (instance.state) {
            case "NEW":
              const { outer, contentContainer } = createModalFrame();
              instance.container = outer;
              instance.cleanup = renderExtension(
                contentContainer,
                "",
                "",
                instance.extensionId,
                undefined,
                instance.props
              );
              instance.state = "MOUNTED";

              modalContainer.prepend(instance.container);
              instance.container.style.visibility = "unset";
              break;
            case "MOUNTED":
              if (instance.container) {
                instance.container.style.visibility = index
                  ? "hidden"
                  : "unset";
              }
              break;

            case "TO_BE_DELETED":
              instance.onClose();
              instance.container?.remove();
              setTimeout(() => {
                modalStore.setState({
                  modalStack: modalStack.filter((x) => x !== instance),
                });
              }, 0);
              return;
          }
        });
      } else {
        modalContainer.style.removeProperty("visibility");
        removeEventListener("keydown", handleEscKey);
      }
    });
  }
}

function closeHighestInstance() {
  const state = modalStore.getState();
  modalStore.setState({
    ...state,
    modalStack: state.modalStack.map((instance, i) =>
      i === 0 ? { ...instance, state: "TO_BE_DELETED" } : instance
    ),
  });
}

function handleEscKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeHighestInstance();
  }
}

/**
 *
 * @param extensionId
 * @param props
 * @param onClose
 * @returns
 */
export function showModal(
  extensionId: string,
  props: Record<string, any> = {},
  onClose: () => void = () => {}
) {
  const instance: ModalInstance = {
    state: "NEW",
    onClose,
    extensionId,
    props,
  };

  const state = modalStore.getState();
  modalStore.setState({
    ...state,
    modalStack: [instance, ...state.modalStack],
  });

  return () => {
    const state = modalStore.getState();
    modalStore.setState({
      ...state,
      modalStack: state.modalStack.map((x) =>
        x.onClose === instance.onClose ? { ...x, state: "TO_BE_DELETED" } : x
      ),
    });
  };
}

globalThis.showModal = showModal;
globalThis.modalStore = modalStore;
