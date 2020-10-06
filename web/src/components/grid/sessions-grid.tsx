import React, { ReactElement, useContext } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SessionCard from "./session-card";
import DateCard from "./date-card";
import { getTeaDetails } from "../../services/parsing-services";
import { TeasState } from "../statecontainers/tea-context";
import { SettingsState } from "../statecontainers/settings-context";
import { SessionsState } from "../statecontainers/session-context";

import { Route } from "../../app";
import { SessionInstance } from "../../services/models";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    width: 240,
    padding: theme.spacing(2),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listItem: {
    width: "100%",
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0.5),
      paddingTop: theme.spacing(1),
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
}));

/**
 * Groups sessions state in a structured object by year/month.
 *
 * @memberOf SessionsGrid
 */
type SessionsData = {
  [year: number]: {
    [month: number]: Array<SessionInstance>;
  };
};

/**
 * SessionsGrid props.
 *
 * @memberOf SessionsGrid
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Grid component containing tea cards. Filters tea cards based on
 * global filter state.
 *
 * @component
 * @subcategory Main
 */
function SessionsGrid({ setRoute, isMobile }: Props): ReactElement {
  const classes = useStyles();

  const teasState = useContext(TeasState);
  const sessionsState = useContext(SessionsState);
  const settings = useContext(SettingsState);

  let data: SessionsData = {};

  if (sessionsState !== undefined)
    sessionsState.map((session) => {
      const date = new Date(session.created_on);
      const year = date.getFullYear();
      const month = date.getMonth();
      let list: SessionInstance[] = [...data[year][month]];
      list.push(session);
      data = {
        ...data,
        [year]: {
          ...data[year],
          [month]: list,
        },
      };
    });
  const checkboxList = years.reduce(
    (obj: { [index: string]: boolean }, item) => {
      obj[item.toLowerCase()] = false;
      return obj;
    },
    {}
  );
  return (
    <>
      {data &&
        Object.entries(data).map(([year, months]) => {
          Object.entries(months).map(([month, sessions]) => {
            let cards: ReactElement[] = [];

            cards.push(
              <Grid
                item
                className={
                  settings.gridView && !isMobile
                    ? classes.gridItem
                    : classes.listItem
                }
                key={year + month}
              >
                <DateCard
                  date={new Date(`${month}/${year}`)}
                  gridView={!!(settings.gridView && !isMobile)}
                />
              </Grid>
            );

            sessions.map((session) =>
              cards.push(
                <SessionCard
                  sessionData={session}
                  teaData={
                    session.tea
                      ? getTeaDetails(teasState, session.tea)
                      : undefined
                  }
                  gridView={!!(settings.gridView && !isMobile)}
                  setRoute={setRoute}
                />
              )
            );

            return cards;
          });
        })}
    </>
  );
}

export default SessionsGrid;
