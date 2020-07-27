import React from "react";
import { Box, List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./InputAppBar";
import InputItem from "./InputItem";
import { formListStyles } from "../../style/FormListStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
  textField: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: "right",
  },
}));

export default function EditWeightList({
  data,
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation weight list input component.
   *
   * @param data {{max: int , increments: int}} Weight list data
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param field {string} Input field name
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const classes = useStyles();
  const formListClasses = formListStyles();

  const crop = data.increment < 1 ? 1 : 0;
  const list = [...Array(data.max / data.increment + 1)]
    .map((_, b) => String((b * data.increment).toFixed(crop)))
    .reverse();

  function handleClick(weight) {
    if (field === "gongfu_weight")
      setTeaData({
        ...teaData,
        gongfu_brewing: {
          ...teaData.gongfu_brewing,
          weight: parseFloat(weight),
        },
      });
    else if (field === "western_weight")
      setTeaData({
        ...teaData,
        western_brewing: {
          ...teaData.western_brewing,
          weight: parseFloat(weight),
        },
      });
    else setTeaData({ ...teaData, [field]: weight });
    handleBackToLayout();
  }

  return (
    <Box className={classes.root}>
      <InputAppBar handleBackToLayout={handleBackToLayout} name={field} />
      <List className={formListClasses.list}>
        {list.map((w) => (
          <InputItem
            key={w}
            name={w + "g"}
            value=""
            handleClick={() => handleClick(w)}
          />
        ))}
      </List>
    </Box>
  );
}
