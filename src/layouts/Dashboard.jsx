import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import * as requestApi from 'api/requestApi';
import { connect } from "react-redux";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import dashboardRoutes from "routes/dashboard.jsx";
import appStyle from "assets/jss/layouts/dashboardStyle.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
  //dangerouslyUseGlobalCSS: true,
  productionPrefix: 'dashboardx',
});

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
      if (prop.collapse)
        return prop.views.map((prop, key) => {
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        });
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false
    };
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps/full-screen-maps";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      // eslint-disable-next-line
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }

  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  render() {
    const { classes, ...rest } = this.props;

    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div className={classes.wrapper}>
        <JssProvider generateClassName={generateClassName}>

          <Sidebar
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            bgColor="white"
            miniActive={this.state.miniActive}
            {...rest}
          />
        </JssProvider>
        <div className={mainPanel} ref="mainPanel">
          <JssProvider generateClassName={generateClassName}>

            <Header
              sidebarMinimize={this.sidebarMinimize.bind(this)}
              miniActive={this.state.miniActive}
              routes={dashboardRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              {...rest}
            />
          </JssProvider>

          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          <GridContainer justify="center">
            <ItemGrid sm={12} xs={12} lg={6} md={6}>
              {this.getRoute() ? (
                <div className={classes.content}>
                  <div className={classes.container}>{switchRoutes}</div>
                </div>
              ) : (
                  <div className={classes.map}>{switchRoutes}</div>
                )}
            </ItemGrid>
          </GridContainer>

          {null}
        </div>

      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    updateState: (type, text) => dispatch({ type: type, text })
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appStyle)(Dashboard))
