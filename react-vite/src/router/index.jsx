import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import Layout from './Layout';
import AddSongPage from '../components/AddSongPage/AddSongPage';
import TrackCreator from '../components/TrackCreator/TrackCreator';
import TrackOverview from '../components/TrackOverview/TrackOverview';
import Gameplay from '../components/Gameplay';
import SessionOverview from '../components/SessionOverview/SessionOverview';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/add-song",
        element: <AddSongPage />
      },
      {
        path: '/track-overview/:trackId',
        element: <TrackOverview />
      },
      {
        path: '/session-overview/:username',
        element: <SessionOverview />
      }
    ],
  },
  {
    path: "/track-creator/:songId",
    element: <TrackCreator />
  },
  {
    path: '/play/:trackId',
    element: <Gameplay />
  }
]);
