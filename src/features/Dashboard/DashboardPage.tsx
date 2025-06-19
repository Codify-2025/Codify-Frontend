import Layout from '@components/Layout';
import UserInfoHeader from './UserInfoHeader';
import DashboardMain from './DashboardMain';

const DashboardPage = () => {
  return (
    <Layout>
      <UserInfoHeader />
      <DashboardMain />
    </Layout>
  );
};

export default DashboardPage;
