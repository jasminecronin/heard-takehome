import { useEffect, useState } from "react";
import { Button, Overlay2, OverlaysProvider } from "@blueprintjs/core";
import axios from "axios";
import styles from "./App.module.css";

interface Transaction {
  title: string;
  description: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  transactionDate: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [amount, setAmount] = useState("");
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const toggleOverlay = useCallback(() => setIsOverlayOpen(open => !open), [setIsOverlayOpen]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Read and display all transactions
  useEffect(() => {
    axios.get("http://localhost:3001/transactions").then((res) => setTransactions(res.data));
  }, []);

  const openAddDialog = () => {
    setSelectedTransaction({
      title: "",
      description: "",
      amount: 0,
      fromAccount: "",
      toAccount: "",
      transactionDate: ""
    });
    setIsAddMode(true);
    setIsOverlayOpen(true);
  };

  // Create a new transaction
  const addTransaction = () => {
      const lastTransaction = transactions[transactions.length - 1];
      // Bit of hacky string manipulation to get the next transaction ID
      const newTitle = `${lastTransaction.title.split("_")[0]}_${parseInt(lastTransaction.title.split('_')[1]) + 1}`;
      const newTransaction = { ...selectedTransaction, title: newTitle };
      axios.post("http://localhost:3001/transactions", newTransaction).then((res) => {
        setTransactions([...transactions, res.data]);
        setIsOverlayOpen(false);
        setSelectedTransaction(null);
      });
  };

  const openUpdateDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsAddMode(false);
    setIsOverlayOpen(true);
  };

  // Update a transaction with new values
  const updateTransaction = () => {
    if (selectedTransaction) {
      axios.put(`http://localhost:3001/transactions/${selectedTransaction.title}`, selectedTransaction).then((res) => {
        setTransactions(transactions.map((t) => t.title === selectedTransaction?.title ? res.data : t));
        setIsOverlayOpen(false);
        setSelectedTransaction(null);
      });
    }
  };

  // Delete a transaction
  const deleteTransaction = (title: string) => {
    axios.delete(`http://localhost:3001/transactions/${title}`).then(() => {
      setTransactions(transactions.filter((t) => t.title !== title));
    });
  };

  return (
    <div className={styles.container}>
      <OverlaysProvider>
        <div>
          <h2 className={styles.tableTitle}>Transactions</h2>
          <div className={styles.headerContainer}>
            <Button intent="primary" onClick={openAddDialog}>Add Transaction</Button>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHeader}>Title</div>
            <div className={styles.tableHeader}>Description</div>
            <div className={styles.tableHeader}>Amount</div>
            <div className={styles.tableHeader}>From</div>
            <div className={styles.tableHeader}>To</div>
            <div className={styles.tableHeader}>Date</div>
            <div /><div /> {/* empty divs for the update/delete buttons */}
            {transactions.map((t) => (
              <div key={t.title} className={styles.tableRow}>
                <div>{t.title}</div>
                <div>{t.description}</div>
                <div>${t.amount}</div>
                <div>{t.fromAccount}</div>
                <div>{t.toAccount}</div>
                <div>{t.transactionDate}</div>
                <Button icon="edit" intent="primary" onClick={() => openUpdateDialog(t)}>Update</Button>
                <Button icon="trash" intent="danger" onClick={() => deleteTransaction(t.title)}>Delete</Button>
              </div>
            ))}
          </div>
        </div>

        <Overlay2 isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)}>
          <div className={styles.overlayWrapper}>
            <div className={styles.overlayCard}>
              <h3>{isAddMode ? "Add Transaction" : "Update Transaction"}</h3>
              {selectedTransaction && (
                <div className={styles.overlayContent}>
                  {!isAddMode && (
                    <>
                      <p className={styles.overlayLabel}>Title:</p>
                      <p>{selectedTransaction.title}</p>
                    </>
                  )}
                  <label className={styles.overlayLabel}>
                    Description:
                    <input
                      type="text"
                      value={selectedTransaction.description}
                      onChange={(e) => setSelectedTransaction({ ...selectedTransaction, description: e.target.value })}
                    />
                  </label>
                  <label className={styles.overlayLabel}>
                    Amount:
                    <input
                      type="number"
                      value={selectedTransaction.amount}
                      onChange={(e) => setSelectedTransaction({ ...selectedTransaction, amount: parseFloat(e.target.value) })}
                    />
                  </label>
                  <label className={styles.overlayLabel}>
                    From Account:
                    <input
                      type="text"
                      value={selectedTransaction.fromAccount}
                      onChange={(e) => setSelectedTransaction({ ...selectedTransaction, fromAccount: e.target.value })}
                    />
                  </label>
                  <label className={styles.overlayLabel}>
                    To Account:
                    <input
                      type="text"
                      value={selectedTransaction.toAccount}
                      onChange={(e) => setSelectedTransaction({ ...selectedTransaction, toAccount: e.target.value })}
                    />
                  </label>
                  <label className={styles.overlayLabel}>
                    Transaction Date:
                    <input
                      type="date"
                      value={selectedTransaction.transactionDate}
                      onChange={(e) => setSelectedTransaction({ ...selectedTransaction, transactionDate: e.target.value })}
                    />
                  </label>
                  <Button intent="primary" onClick={isAddMode ? addTransaction : updateTransaction}>
                    {isAddMode ? "Add" : "Update"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Overlay2>
      </OverlaysProvider>
    </div>
  );
}

export default App;

// todos
// done - fix the typing errors
// done - style it better
// done - update the styling to properly display the right format in a table
// done - update the read function
// done - add a dialog to add a record with the right fields
// done - update the add transaction to handle the new fields
// done - update the front-end to handle record update
// done - add function to update a transaction
// done - adjust the styling of delete button
// done - update the delete transaction to use the right fields so it won't crap out
// maybe add some basic error handling on the inputs?
// polish, documentation and comments
