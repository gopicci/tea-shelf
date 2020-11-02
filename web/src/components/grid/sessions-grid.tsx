import React, { ReactElement, useContext } from "react";
import { Grid } from "@material-ui/core";
import SessionCard from "./session-card";
import DateCard from "./date-card";
import { gridStyles } from "../../style/grid-styles";
import { SettingsState } from "../statecontainers/settings-context";
import { SessionsState } from "../statecontainers/session-context";
import { Route } from "../../app";
import { SessionInstance } from "../../services/models";

/**
 * Structured object to group sessions state by year/month.
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
 * Grid component containing session cards. Groups them by month with DateCards.
 *
 * @component
 * @subcategory Grid
 */
function SessionsGrid({ setRoute, isMobile }: Props): ReactElement {
  const classes = gridStyles();

  const sessionsState = useContext(SessionsState);
  const settings = useContext(SettingsState);

  const data = sessionsState.reduce((obj: SessionsData, session) => {
    const date = new Date(session.created_on);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!obj[year]?.[month])
      obj[year] = {
        ...obj[year],
        [month]: [],
      };

    obj[year][month].push(session);
    obj[year][month].sort((a, b) => {
      return Date.parse(b.created_on) - Date.parse(a.created_on);
    });

    return obj;
  }, {});

  return (
    <Grid container justify="center" className={classes.sessionGrid}>
      {data &&
        Object.entries(data).map(([year, months]) => {
          return Object.entries(months)
            .reverse()
            .map(([month, sessions]) => {
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
                    date={new Date(parseInt(year), parseInt(month))}
                    gridView={!!(settings.gridView && !isMobile)}
                  />
                </Grid>
              );

              sessions.map((session) =>
                cards.push(
                  <Grid
                    item
                    className={
                      settings.gridView && !isMobile
                        ? classes.gridItem
                        : classes.listItem
                    }
                    key={session.offline_id}
                  >
                    <SessionCard
                      session={session}
                      gridView={!!(settings.gridView && !isMobile)}
                      setRoute={setRoute}
                    />
                  </Grid>
                )
              );

              return cards;
            });
        })}
    </Grid>
  );
}

export default SessionsGrid;
