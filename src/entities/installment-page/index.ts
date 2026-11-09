export { saveInstallmentPage } from './api/installment-page-api';
export {
  adminInstallmentPageQueryKey,
  adminInstallmentPageQueryOptions,
  installmentPageQueryKey,
  installmentPageQueryOptions,
} from './api/installment-page-queries';
export { buildDefaultInstallmentContent, resolveInstallmentContent } from './lib/resolve-installment-content';
export type {
  InstallmentPageCard,
  InstallmentPageContent,
  InstallmentPageLabeledValue,
  InstallmentPageLoan,
  InstallmentPageResponse,
} from './model/types';
