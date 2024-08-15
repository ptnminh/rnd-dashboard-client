import "react-loading-skeleton/dist/skeleton.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./styles/app.sass";
import Page from "./components/Page";
import NewCampaigns from "./screens/NewProduct";
import TemplateKW from "./screens/TemplateKW";
import DesignerScreens from "./screens/Designer";
import EPMScreens from "./screens/EPM";
import { ProductLine } from "./screens/ProductLine";
import { CreateWaitingPosts, MKTScreens } from "./screens/Marketing";
import DesignerFeedbackScreens from "./screens/DesignerFeedback";
import RootCampaign from "./screens/RootCampaign";
import Caption from "./screens/Caption";
import ManageAccounts from "./screens/ManageAccounts";
import CreatePost from "./screens/CreatePost";
import CreateCampsScreen from "./screens/CreateCamps";
import CreatedCampsScreen from "./screens/CreatedCamps";
import VideoScreens from "./screens/Video";
import Auth0LoginScreen from "./screens/Auth0Login";
import Page404 from "./screens/NotFound";
import ForbiddenPage from "./components/ForbidenPage";

function App() {
  return (
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
        path="/designer/video"
        element={
          <Page title="Designer Feedback">
            <VideoScreens />
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
            <CreateWaitingPosts />
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
      <Route path="/sign-up" element={<Auth0LoginScreen />} />
      <Route path="/sign-in" element={<Auth0LoginScreen />} />
      <Route path="*" element={<Page404 />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
    </Routes>
  );
}

export default App;
