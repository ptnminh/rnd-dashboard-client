import "react-loading-skeleton/dist/skeleton.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.sass";
import Page from "./components/Page";
import NewCampaigns from "./screens/NewProduct";
import Drafts from "./screens/Drafts";
import Released from "./screens/Released";
import Comments from "./screens/Comments";
import Scheduled from "./screens/Scheduled";
import Customers from "./screens/Customers";
import TemplateKW from "./screens/TemplateKW";
import Promote from "./screens/Promote";
import Notification from "./screens/Notification";
import Settings from "./screens/Settings";
import UpgradeToPro from "./screens/UpgradeToPro";
import MessageCenter from "./screens/MessageCenter";
import ExploreCreators from "./screens/ExploreCreators";
import AffiliateCenter from "./screens/AffiliateCenter";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Earning from "./screens/Earning";
import Refunds from "./screens/Refunds";
import Payouts from "./screens/Payouts";
import Statements from "./screens/Statements";
import Shop from "./screens/Shop";
import PageList from "./screens/PageList";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Page title="Campaigns">
              <NewCampaigns />
            </Page>
          }
        />
        <Route
          path="/campaigns/dashboard"
          element={
            <Page title="Campaigns dashboard">
              <NewCampaigns />
            </Page>
          }
        />
        <Route
          path="/campaigns/add"
          element={
            <Page title="Campaigns">
              <NewCampaigns />
            </Page>
          }
        />
        <Route
          path="/campaigns/history"
          element={
            <Page title="Campaigns">
              <Drafts />
            </Page>
          }
        />
        <Route
          path="/campaigns/template"
          element={
            <Page title="Campaigns">
              <TemplateKW />
            </Page>
          }
        />
        <Route
          path="/campaigns/drafts"
          element={
            <Page title="Drafts">
              <Drafts />
            </Page>
          }
        />
        <Route
          path="/campaigns/released"
          element={
            <Page title="Released">
              <Released />
            </Page>
          }
        />
        <Route
          path="/campaigns/comments"
          element={
            <Page title="Comments">
              <Comments />
            </Page>
          }
        />
        <Route
          path="/campaigns/scheduled"
          element={
            <Page title="Scheduled">
              <Scheduled />
            </Page>
          }
        />
        <Route
          path="/customers/overview"
          element={
            <Page title="Customers">
              <Customers />
            </Page>
          }
        />
        <Route
          path="/customers/customer-list"
          element={
            <Page title="Customer list">
              <TemplateKW />
            </Page>
          }
        />
        <Route
          path="/shop"
          element={
            <Page wide>
              <Shop />
            </Page>
          }
        />
        <Route
          path="/income/earning"
          element={
            <Page title="Earning">
              <Earning />
            </Page>
          }
        />
        <Route
          path="/income/refunds"
          element={
            <Page title="Refunds">
              <Refunds />
            </Page>
          }
        />
        <Route
          path="/income/payouts"
          element={
            <Page title="Payouts">
              <Payouts />
            </Page>
          }
        />
        <Route
          path="/income/statements"
          element={
            <Page title="Statements">
              <Statements />
            </Page>
          }
        />
        <Route
          path="/promote"
          element={
            <Page title="Promote">
              <Promote />
            </Page>
          }
        />
        <Route
          path="/notification"
          element={
            <Page title="Notification">
              <Notification />
            </Page>
          }
        />
        <Route
          path="/settings"
          element={
            <Page title="Settings">
              <Settings />
            </Page>
          }
        />
        <Route
          path="/upgrade-to-pro"
          element={
            <Page title="Upgrade to Pro">
              <UpgradeToPro />
            </Page>
          }
        />
        <Route
          path="/message-center"
          element={
            <Page title="Message center">
              <MessageCenter />
            </Page>
          }
        />
        <Route
          path="/explore-creators"
          element={
            <Page title="Explore creators">
              <ExploreCreators />
            </Page>
          }
        />
        <Route
          path="/affiliate-center"
          element={
            <Page title="Affiliate center">
              <AffiliateCenter />
            </Page>
          }
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/pagelist" element={<PageList />} />
      </Routes>
    </Router>
  );
}

export default App;
