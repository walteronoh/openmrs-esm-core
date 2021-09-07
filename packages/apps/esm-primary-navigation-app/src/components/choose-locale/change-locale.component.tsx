import React, { useEffect, useState } from "react";
import { Dropdown } from "carbon-components-react";
import styles from "./change-locale.component.scss";
import { LoggedInUser } from "@openmrs/esm-framework";
import { PostUserProperties } from "./change-locale.resource";

export interface ChangeLocaleProps {
  allowedLocales: Array<string>;
  user: LoggedInUser;
  postUserProperties: PostUserProperties;
}

const ChangeLocale: React.FC<ChangeLocaleProps> = ({
  allowedLocales,
  user,
  postUserProperties,
}) => {
  const [userProps, setUserProps] = useState(user.userProperties);

  useEffect(() => {
    if (user.userProperties.defaultLocale !== userProps.defaultLocale) {
      const ac = new AbortController();
      postUserProperties(user.uuid, userProps, ac);
      return () => ac.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProps]);

  const items = allowedLocales?.map((locale) => {
    return {
      id: locale,
      text: locale,
      value: locale,
    };
  });

  return (
    <div className={`omrs-margin-12 ${styles.labelselect}`}>
      <Dropdown
        id="selectLocale"
        items={items}
        itemToString={(item) => (item ? item.text : "")}
        label={userProps.defaultLocale}
        invalidText="A valid value locale is required"
        onChange={(event) =>
          setUserProps({
            ...userProps,
            defaultLocale: event.selectedItem.value,
          })
        }
        onClick={(event) => event.stopPropagation()}
        titleText="Select locale"
      />
    </div>
  );
};

export default ChangeLocale;
