import Layout from '@components/Layout';
import UserInfoHeader from './UserInfoHeader';
import DashboardMain from './DashboardMain';

const DashboardPage = () => {
  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-6">
        <UserInfoHeader />
        <DashboardMain />
      </div>
    </Layout>
  );
};

export default DashboardPage;
