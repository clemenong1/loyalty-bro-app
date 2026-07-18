import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedLayout } from '@/components/protected-layout';
import { AddMembershipPage } from '@/pages/add-membership-page';
import { LoginPage } from '@/pages/login-page';
import { MembershipDetailPage } from '@/pages/membership-detail-page';
import { SignupPage } from '@/pages/signup-page';
import { WalletPage } from '@/pages/wallet-page';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<WalletPage />} />
        <Route path="/add" element={<AddMembershipPage />} />
        <Route path="/membership/:id" element={<MembershipDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
