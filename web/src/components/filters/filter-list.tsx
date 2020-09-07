import React, { ChangeEvent, ReactElement, useContext, useState } from "react";
import {
  Collapse,
  FormGroup,
  FormLabel,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import CheckboxListItem from "../generics/checkbox-list-item";
import { FilterDispatch } from "../statecontainers/filter-context";
import { formListStyles } from "../../style/form-list-styles";
import { Filters } from "../../services/models";

// Typing separately from props for jsdoc issue
type ListName = "sorting" | keyof Filters["filters"]

/**
 * FilterList props.
 *
 * @memberOf FilterList
 */
type Props = {
  /** Filter list name, can be sorting or one of the filter model options */
  entry: ListName;
  /** Filter list item in {name: checked} format */
  list: { [name: string]: boolean };
};

/**
 * Filters checkbox list component.
 *
 * @component
 * @subcategory Filters
 */
function FilterList({ entry, list }: Props): ReactElement {
  const formListClasses = formListStyles();

  const dispatch = useContext(FilterDispatch);

  /**
   * Dispatches central filter state updates.
   *
   * @param {ChangeEvent} event - Filter changing event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (entry === "sorting")
      dispatch({
        type: "CHECK_SORT",
        data: { item: event.target.name },
      });
    else
      dispatch({
        type: "CHECK_FILTER",
        data: { entry: entry, item: event.target.name },
      });
  }

  const [open, setOpen] = useState(false);

  /** Expands list to show all items */
  function handleShowAllClick(): void {
    setOpen(!open);
  }

  return (
    <FormGroup>
      <FormLabel className={formListClasses.formLabel}>
        <Typography className={formListClasses.formLabelText}>
          {entry === "sorting" ? "Sort by" : entry}:
        </Typography>
      </FormLabel>
      <List className={formListClasses.list}>
        {list &&
          Object.entries(list)
            .slice(0, 3)
            .map(([item, checked]) => (
              <CheckboxListItem
                key={item}
                name={item}
                checked={checked}
                handleChange={handleChange}
              />
            ))}
        {list && Object.entries(list).length > 3 && !open && (
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
          {list &&
            Object.entries(list)
              .slice(3)
              .map(([item, checked]) => (
                <CheckboxListItem
                  key={item}
                  name={item}
                  checked={checked}
                  handleChange={handleChange}
                />
              ))}
        </Collapse>
      </List>
    </FormGroup>
  );
}

export default FilterList;
