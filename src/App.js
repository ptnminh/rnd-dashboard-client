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
import ScreenshotTask from "./screens/ScreenShotTask";
import Mockup from "./screens/Mockup";
import ComingSoon from "./screens/ComingSoon";
import Dashboards from "./screens/Dashboards";
import DashboardChartJS from "./screens/Dashboards/chart";
import DashboardSetting from "./screens/DashboardSetting";
import ProductivityDashboard from "./screens/ProductivityDashboard";
import Sellerboard from "./screens/Sellerboard";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Page title="Board">
            <ComingSoon />
          </Page>
        }
      />
      <Route
        path="/rnd"
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
        path="/product-base/new-clipart/task"
        element={
          <Page title="Artist">
            <ArtistTask />
          </Page>
        }
      />
      <Route
        path="/product-base/new-clipart/brief"
        element={
          <Page title="Artist">
            <ArtistScreen />
          </Page>
        }
      />
      <Route
        path="/product-base/new-product-line"
        element={
          <Page title="Product Line">
            <BriefProductLine />
          </Page>
        }
      />
      <Route
        path="/product-base"
        element={
          <Page title="Product Line">
            <BriefProductLine />
          </Page>
        }
      />
      <Route
        path="/product-base/new-product-line/task"
        element={
          <Page title="Product Line">
            <BriefProductLineTask />
          </Page>
        }
      />

      <Route
        path="/product-base/mockup/ready-to-launch"
        element={
          <Page title="Product Line">
            <ProductLineReadyToLaunch />
          </Page>
        }
      />
      <Route
        path="/product-base/mockup/task"
        element={
          <Page title="Product Line">
            <Mockup />
          </Page>
        }
      />
      <Route
        path="/product-base/mockup/photography"
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
        path="/mkt/material/root-campaign"
        element={
          <Page title="MKT">
            <RootCampaign />
          </Page>
        }
      />
      <Route
        path="/mkt/material/caption"
        element={
          <Page title="MKT">
            <Caption />
          </Page>
        }
      />
      <Route
        path="/mkt/material/account"
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
        path="/mkt/material/setting"
        element={
          <Page title="MKT">
            <Setting name="mkt-camp" />
          </Page>
        }
      />
      <Route
        path="/product-base/new-clipart/setting"
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
        path="/product-base/new-product-line/setting"
        element={
          <Page title="MKT">
            <Setting name="new-product-line" />
          </Page>
        }
      />
      <Route
        path="/product-base/mockup/setting"
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

      <Route
        path="/rnd"
        element={
          <Page title="MKT">
            <UserScreen />
          </Page>
        }
      />
      <Route
        path="/dashboard/rechart"
        element={
          <Page title="MKT">
            <DashboardSetting />
          </Page>
        }
      />
      <Route
        path="/dashboard/default-setting"
        element={
          <Page title="MKT">
            <DashboardSetting />
          </Page>
        }
      />
      <Route
        path="/dashboard/sales"
        element={
          <Page title="MKT">
            <ProductivityDashboard />
          </Page>
        }
      />
      <Route
        path="/dashboard/amz-seller-board"
        element={
          <Page title="MKT">
            <Sellerboard />
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
