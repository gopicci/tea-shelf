import React, {ChangeEvent, ReactElement, useState} from 'react';
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
import CheckboxListItem from "./checkbox-list-item";

/**
 * CheckboxList props.
 *
 * @memberOf CheckboxList
 */
type Props = {
  /** List title */
  label?: string;
  /** Checkbox list array in {name: checked} format */
  list: { [name: string]: boolean };
  /** Callback to update items checked status */
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** If true only first 3 items are shown */
  isCollapsed?: boolean;
  /** If true list options are shown in reverse order */
  reverse?: boolean;
}

/**
 * Generic checkbox list component.
 *
 * @component
 * @subcategory Helpers
 */
function CheckboxList({
  label,
  list,
  handleChange,
  isCollapsed = false,
  reverse = false,
}: Props): ReactElement {
  const formListClasses = formListStyles();

  const [open, setOpen] = useState(false);

  /** Shows complete list */
  function handleShowAllClick(): void {
    setOpen(!open);
  }

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

export default CheckboxList;
