import "react-loading-skeleton/dist/skeleton.css";
import { Routes, Route } from "react-router-dom";
import "./styles/app.sass";
import Page from "./components/Page";
import NewBriefs from "./screens/NewBriefs";
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
import ForbiddenPage from "./components/ForbiddenPage";
import Setting from "./screens/Setting";
import UserScreen from "./screens/Users";
import EmailVerify from "./components/VerifyEmail";
import ArtistScreen from "./screens/Artist";
import BriefProductLine from "./screens/BriefProductLine";
import ArtistTask from "./screens/ArtistTask";
import BriefProductLineTask from "./screens/ProductLineTask";
import ProductLineReadyToLaunch from "./screens/ProductLineReadyToLaunch";
import MockupTask from "./screens/MockupTask";
import ScreenshotTask from "./screens/ScreenShotTask";
import Mockup from "./screens/Mockup";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Page title="Board">
            <NewBriefs />
          </Page>
        }
      />
      <Route
        path="/rnd/brief"
        element={
          <Page title="Board">
            <NewBriefs />
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
        path="/designer"
        element={
          <Page title="Campaigns">
            <DesignerScreens />
          </Page>
        }
      />
      <Route
        path="/artist"
        element={
          <Page title="Artist">
            <ArtistTask />
          </Page>
        }
      />
      <Route
        path="/rnd/artist"
        element={
          <Page title="Artist">
            <ArtistScreen />
          </Page>
        }
      />
      <Route
        path="/rnd/brief-pl"
        element={
          <Page title="Product Line">
            <BriefProductLine />
          </Page>
        }
      />
      <Route
        path="/pl"
        element={
          <Page title="Product Line">
            <BriefProductLineTask />
          </Page>
        }
      />

      <Route
        path="/pl/ready-to-launch"
        element={
          <Page title="Product Line">
            <ProductLineReadyToLaunch />
          </Page>
        }
      />
      <Route
        path="/pl/mockup"
        element={
          <Page title="Product Line">
            <Mockup />
          </Page>
        }
      />
      <Route
        path="/pl/screenshot"
        element={
          <Page title="Product Line">
            <ScreenshotTask />
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
        path="/video"
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
      <Route
        path="/mkt/setting"
        element={
          <Page title="MKT">
            <Setting name="mkt" />
          </Page>
        }
      />
      <Route
        path="/artist/setting"
        element={
          <Page title="MKT">
            <Setting name="art" />
          </Page>
        }
      />
      <Route
        path="/video/setting"
        element={
          <Page title="MKT">
            <Setting name="design" />
          </Page>
        }
      />
      <Route
        path="/designer/setting"
        element={
          <Page title="MKT">
            <Setting name="design" />
          </Page>
        }
      />
      <Route
        path="/epm/setting"
        element={
          <Page title="MKT">
            <Setting name="epm" />
          </Page>
        }
      />
      <Route
        path="/pl/setting"
        element={
          <Page title="MKT">
            <Setting name="new-product-line" />
          </Page>
        }
      />
      <Route
        path="/pl/setting/mockup"
        element={
          <Page title="MKT">
            <Setting name="mockup" />
          </Page>
        }
      />
      <Route
        path="/users"
        element={
          <Page title="MKT">
            <UserScreen />
          </Page>
        }
      />
      <Route path="/sign-up" element={<Auth0LoginScreen />} />
      <Route path="/sign-in" element={<Auth0LoginScreen />} />
      <Route path="*" element={<Page404 />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/verify-email" element={<EmailVerify />} />
    </Routes>
  );
}

export default App;
