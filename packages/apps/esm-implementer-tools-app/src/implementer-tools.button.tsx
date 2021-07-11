import React from "react";
import Close20 from "@carbon/icons-react/es/close/20";
import Tools20 from "@carbon/icons-react/es/tools/20";
import styles from "./implementer-tools.styles.css";
import { UserHasAccess, useStore } from "@openmrs/esm-framework";
import { implementerToolsStore, togglePopup } from "./store";
import { HeaderGlobalAction } from "carbon-components-react/es/components/UIShell";
import { useTranslation } from "react-i18next";

interface ImplementerToolsButtonProps {
  isActivePanel: Function;
  togglePanel: Function;
}

const ImplementerToolsButton: React.FC<ImplementerToolsButtonProps> = ({
  isActivePanel,
  togglePanel,
}) => {
  const { t } = useTranslation();
  const { hasAlert } = useStore(implementerToolsStore);

  return (
    <UserHasAccess privilege="coreapps.systemAdministration">
      <HeaderGlobalAction
        aria-label={t("implementerTools", "Implementer Tools")}
        aria-labelledby="Implementer Tools"
        className={styles.toolStyles}
        name="ImplementerToolsIcon"
        onClick={() => {
          togglePanel("implementerToolsMenu");
          togglePopup();
        }}
      >
        {isActivePanel("implementerToolsMenu") ? (
          <Close20 />
        ) : (
          <Tools20
            className={`${styles.popupTriggerButton} ${
              hasAlert ? styles.triggerButtonAlert : ""
            }`}
          />
        )}
      </HeaderGlobalAction>
    </UserHasAccess>
  );
};

export default ImplementerToolsButton;
