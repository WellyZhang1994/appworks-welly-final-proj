import React,{lazy, Suspense} from "react";
import { Route, Switch, withRouter, useLocation} from "react-router-dom"
import Header from './components/header'

//lazy loading 
const homePage = lazy(() => import('./pages/home'));
const companyPage = lazy(() => import('./pages/company'));
const aboutUsPage = lazy(() => import('./pages/aboutus'));
const notfound = lazy(() => import('./components/notfound'));

const App: any = () =>
{
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="page" >
        {<Header />}
        <Switch>
          <Route exact path="/" component={companyPage} />
          <Route exact path="/company" component={companyPage} />
          <Route exact path="/about" component={aboutUsPage} />
          <Route exact path="*" component={notfound} />
          
        </Switch>
      </div>
    </Suspense>
  );
};

export default withRouter(App);