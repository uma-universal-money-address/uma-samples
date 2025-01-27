const PaymentIndicator = ({ paymentAmount }: { paymentAmount: number }) => (
  <div className="text-grey ml-3 inline-block rounded-full border bg-white px-4 py-1 text-xs shadow-sm">
    ${paymentAmount.toFixed(2)}
  </div>
);

export default PaymentIndicator;
