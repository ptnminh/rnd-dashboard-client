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
import DesignerScreens from "./screens/Designer";
import EPMScreens from "./screens/EPM";
import { ProductLine } from "./screens/ProductLine";
import MKTScreens from "./screens/Marketing";
import DesignerFeedbackScreens from "./screens/DesignerFeedback";
import RootCampaign from "./screens/RootCampaign";
import Caption from "./screens/Caption";
import ManageAccounts from "./screens/ManageAccounts";
import CreatePost from "./screens/CreatePost";
import CreateCampsScreen from "./screens/CreateCamps";
import CreatedCampsScreen from "./screens/CreatedCamps";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Page title="Board">
              <NewCampaigns />
            </Page>
          }
        />
        <Route
          path="/rnd/brief"
          element={
            <Page title="Board">
              <NewCampaigns />
            </Page>
          }
        />
        <Route
          path="/rnd/product-line"
          element={
            <Page title="Campaigns dashboard">
              <ProductLine />
            </Page>
          }
        />
        <Route
          path="/rnd/collection"
          element={
            <Page title="Campaigns">
              <TemplateKW />
            </Page>
          }
        />
        <Route
          path="/rnd/layout"
          element={
            <Page title="Campaigns">
              <TemplateKW />
            </Page>
          }
        />
        <Route
          path="/designer"
          element={
            <Page title="Campaigns">
              <DesignerScreens />
            </Page>
          }
        />
        <Route
          path="/designer/feedback"
          element={
            <Page title="Designer Feedback">
              <DesignerFeedbackScreens />
            </Page>
          }
        />
        <Route
          path="/epm"
          element={
            <Page title="EPM">
              <EPMScreens />
            </Page>
          }
        />
        <Route
          path="/mkt"
          element={
            <Page title="MKT">
              <MKTScreens />
            </Page>
          }
        />
        <Route
          path="/mkt/post"
          element={
            <Page title="MKT">
              <MKTScreens />
            </Page>
          }
        />
        <Route
          path="/mkt/post/create"
          element={
            <Page title="MKT">
              <CreatePost />
            </Page>
          }
        />
        <Route
          path="/mkt/root-campaign"
          element={
            <Page title="MKT">
              <RootCampaign />
            </Page>
          }
        />
        <Route
          path="/mkt/caption"
          element={
            <Page title="MKT">
              <Caption />
            </Page>
          }
        />
        <Route
          path="/mkt/account"
          element={
            <Page title="MKT">
              <ManageAccounts />
            </Page>
          }
        />
        <Route
          path="/mkt/post"
          element={
            <Page title="MKT">
              <CreatePost />
            </Page>
          }
        />
        <Route
          path="/mkt/post/dashboard"
          element={
            <Page title="MKT">
              <MKTScreens />
            </Page>
          }
        />
        <Route
          path="/mkt/post"
          element={
            <Page title="MKT">
              <CreatePost />
            </Page>
          }
        />
        <Route
          path="/mkt/camp/dashboard"
          element={
            <Page title="MKT">
              <CreateCampsScreen />
            </Page>
          }
        />
        <Route
          path="/mkt/camp/created"
          element={
            <Page title="MKT">
              <CreatedCampsScreen />
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
