/**
 * @file Mock payment gateway for demonstration purposes.  Replace with a real integration for production.
 */

/**
 * Simulates a payment processing request.  Always returns success in this mock.
 * @async
 * @param {object} paymentDetails - Payment details object.  Must contain amount.
 * @param {number} paymentDetails.amount - The amount to be paid.
 * @returns {Promise<object>} A promise resolving to a payment confirmation object.  Rejects on invalid input.
 * @throws {Error} If paymentDetails.amount is missing or not a number.
 */
async function processPayment(paymentDetails) {
  if (!paymentDetails || typeof paymentDetails.amount !== 'number' || paymentDetails.amount <= 0) {
    throw new Error('Invalid payment details. Amount must be a positive number.');
  }

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    transactionId: 'mock-transaction-' + Math.random().toString(36).substring(7),
    status: 'approved',
    amount: paymentDetails.amount,
  };
}


/**
 *  Mocks a refund operation.  Always returns success in this mock.
 * @async
 * @param {string} transactionId - The ID of the transaction to refund.
 * @param {number} amount - The amount to refund.
 * @returns {Promise<object>} A promise resolving to a refund confirmation object. Rejects if transactionId is invalid.
 * @throws {Error} If transactionId is missing or invalid, or amount is not positive.
 */
async function processRefund(transactionId, amount) {
  if (!transactionId || typeof transactionId !== 'string' || !amount || amount <=0) {
    throw new Error('Invalid transaction ID or refund amount.');
  }

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    refundId: 'mock-refund-' + Math.random().toString(36).substring(7),
    transactionId: transactionId,
    status: 'approved',
    amount: amount,
  };
}


module.exports = { processPayment, processRefund };