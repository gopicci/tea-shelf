import React, { useState } from "react";
import {
  Collapse,
  FormGroup,
  FormLabel,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";

import { formListStyles } from "../../style/FormListStyles";

import CheckboxListItem from "./CheckboxListItem";

export default function CheckboxList({
  label,
  list,
  handleChange,
  isCollapsed = false,
  reverse = false,
}) {
  /**
   * Generic checkbox list component.
   *
   * @param label {string} List title
   * @param list {[{string: boolean}]} Checkbox list array in {name: checked} format
   * @param handleChange {function} Function to handle items change
   * @param isCollapsed {bool} If true only first 3 items are shown with a showAll option
   * @param reverse {bool} If true list options are shown in reverse order
   */

  const formListClasses = formListStyles();

  const [open, setOpen] = useState(false);

  const handleShowAllClick = () => {
    setOpen(!open);
  };

  const entries = reverse
    ? Object.entries(list).reverse()
    : Object.entries(list);

  return (
    <FormGroup>
      {label && (
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.formLabelText}>
            {label}
          </Typography>
        </FormLabel>
      )}
      <List className={formListClasses.list}>
        {!isCollapsed &&
          entries.map(([item, checked]) => (
            <CheckboxListItem
              key={item}
              name={item}
              checked={checked}
              handleChange={handleChange}
            />
          ))}
        {isCollapsed && (
          <>
            {entries.slice(0, 3).map(([item, checked]) => (
              <CheckboxListItem
                key={item}
                name={item}
                checked={checked}
                handleChange={handleChange}
              />
            ))}
            {entries.length > 3 && !open && (
              <ListItem key="ShowAll" className={formListClasses.listItem}>
                <Link
                  className={formListClasses.linkSmall}
                  onClick={handleShowAllClick}
                >
                  Show all
                </Link>
              </ListItem>
            )}
            <Collapse in={open} timeout="auto">
              {entries.slice(3).map(([item, checked]) => (
                <CheckboxListItem
                  key={item}
                  name={item}
                  checked={checked}
                  handleChange={handleChange}
                />
              ))}
            </Collapse>
          </>
        )}
      </List>
    </FormGroup>
  );
}
