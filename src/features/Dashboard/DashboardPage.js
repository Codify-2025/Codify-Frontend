import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@components/Layout';
import UserInfoHeader from './UserInfoHeader';
import DashboardMain from './DashboardMain';
const DashboardPage = () => {
    return (_jsxs(Layout, { children: [_jsx(UserInfoHeader, {}), _jsx(DashboardMain, {})] }));
};
export default DashboardPage;
