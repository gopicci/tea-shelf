import React, { useContext, useState } from "react";
import {
  Collapse,
  FormGroup,
  FormLabel,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import CheckboxListItem from "../generics/CheckboxListItem";
import { FilterDispatch } from "../statecontainers/filter-context";
import { formListStyles } from "../../style/FormListStyles";

/**
 * Filters checkbox list component. Uses central filter dispatch to handle change.
 *
 * @param entry {string} List name
 * @param list {Array} Filter list array in {name: checked} format
 */
export default function FilterList({ entry, list }) {
  const formListClasses = formListStyles();

  const dispatch = useContext(FilterDispatch);

  const handleChange = (event) => {
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
  };

  const [open, setOpen] = useState(false);

  const handleShowAllClick = () => {
    setOpen(!open);
  };

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
