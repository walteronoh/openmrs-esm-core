import React from "react";
import Switcher from "carbon-components-react/lib/components/UIShell/Switcher";
import SwitcherDivider from "carbon-components-react/lib/components/UIShell/SwitcherDivider";
import styles from "./logout-panel-switcher.component.scss";
import Logout from "../logout/logout.component";

export interface LogoutPanelSwitcherItemProps {
  isLogoutEnabled: boolean;
  onLogout(): void;
}

const LogoutPanelSwitcher: React.FC<LogoutPanelSwitcherItemProps> = ({
  isLogoutEnabled,
  onLogout,
}) => (
  <>
    {isLogoutEnabled && (
      <>
        <SwitcherDivider className={styles.divider} />
        <Switcher aria-label="Switcher Container">
          <Logout onLogout={onLogout} />
        </Switcher>
      </>
    )}
  </>
);

export default LogoutPanelSwitcher;
