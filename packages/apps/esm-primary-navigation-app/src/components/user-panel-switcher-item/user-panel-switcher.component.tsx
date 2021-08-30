import React from "react";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import Switcher from "carbon-components-react/lib/components/UIShell/Switcher";
import styles from "./user-panel-switcher.component.scss";
import { LoggedInUser } from "@openmrs/esm-framework";

export interface UserPanelSwitcherItemProps {
  user: LoggedInUser;
}

const UserPanelSwitcher: React.FC<UserPanelSwitcherItemProps> = ({ user }) => (
  <div className={styles.switcherContainer}>
    <Switcher aria-label="Switcher Container">
      <UserAvatarFilledAlt20 />
      <p>{user.person.display}</p>
    </Switcher>
  </div>
);

export default UserPanelSwitcher;
