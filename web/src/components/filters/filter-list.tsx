import React, {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useContext,
  useState,
} from "react";
import {
  Collapse,
  FormGroup,
  FormLabel,
  IconButton,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import CheckboxListItem from "../generics/checkbox-list-item";
import { FilterDispatch, FilterState } from "../statecontainers/filter-context";
import { formListStyles } from "../../style/form-list-styles";
import { Filters } from "../../services/models";

// Typing separately from props for jsdoc issue
type ListName = "sorting" | keyof Filters["filters"];

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

  const state = useContext(FilterState);
  const dispatch = useContext(FilterDispatch);

  /**
   * Dispatches global filter state updates.
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

  /**
   * Set reversed sorting state
   *
   * @param {MouseEvent<HTMLElement>} event - Icon button click event
   */
  function handleReverseClick(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    dispatch({ type: "REVERSE" });
  }

  return (
    <FormGroup>
      <FormLabel className={formListClasses.formLabel}>
        <Typography className={formListClasses.formLabelText}>
          {entry === "sorting" ? "Sort by" : entry}:
        </Typography>
        {entry === "sorting" && (
          <IconButton
            className={formListClasses.arrowIcon}
            onClick={handleReverseClick}
          >
            {state.reversed ? <ArrowDropUp /> : <ArrowDropDown />}
          </IconButton>
        )}
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
