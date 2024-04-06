import React from "react";
import "./sale_page.css";
import { Button, Modal } from "antd";
import { useState, useEffect, useRef } from "react";
import Invoice from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import Save from "../../image/Save.png";
import { useReactToPrint } from "react-to-print";
import { PosInvoice } from "../../components/Pos.js";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import AvailableQuantity from "../../components/stookquantity/AvilableQunatity";

const SalePage = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    return formattedDate;
  });

  // Use the formattedStock array here

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 because January is 0
  const day = String(today.getDate()).padStart(2, "0");
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const seconds = String(today.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const Color = {
    background: "rgba(6, 52, 27, 1)",
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const Employee = localStorage.getItem("username");
  const [contributor_name, setContributorName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [shopNameData, setShopNAmeData] = useState([]);
  // const [Employee, setEmployee] = useState("");
  const [payment_id, setpaymentId] = useState("");
  const [invoice, setInvoice] = useState("");
  const [pay, setpay] = useState("");
  const [due, setDue] = useState("");
  const [discount, setDiscount] = useState("");
  const [netTotal, setNetTotal] = useState([]);
  const [paid, setPaid] = useState(null);
  const [changeAmount, setChangeAmount] = useState("");
  const [data, setData] = useState([]);
  const [saleTransactionData, setSaleTransactionData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [VAT, setVAT] = useState(0);
  const [paymentTypeData, setpaymentTypeData] = useState([]);
  const [customerData, setCustomer] = useState([]);
  const [VatData, setVatData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [saveData, setSaveData] = useState([]);
  const [vatID, setVatID] = useState("");
  const [saleData, setsaleData] = useState([]);
  const [fixData, setFixData] = useState([]);
  const [contributorNameError, setcontributorNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [vatAmount, setVatAmount] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [available, setAvailable] = useState([]);
  // const [rowDeleteModal, setRowDeltemodal] = useState(false)
  const [cuttingCharge, setCuttingCharge] = useState(null);
  const [dressingCharge, setDressingCharge] = useState(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  
  useEffect(() => {
    document.title = "Sale Page";
    if (paymentTypeData && paymentTypeData.length > 0) {
      const cashpayment = paymentTypeData.find(
        (data) => data.payment_type === "Cash"
      );
      if (cashpayment) {
        setpaymentId(cashpayment.payment_type_id);
      }
    }
  }, [paymentTypeData]);

  // handle data fatch
  const handleDataFetch = async () => {
    try {
      // Make an HTTP GET request using axiosInstance
      const response = await axiosInstance.get(
        "/transactionsRouter/getAllTransactions"
      );

      const filteredPurchaseTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Purchase"
      );
      const filteredSaleTransactions = response.data.filter(
        (transaction) =>
          transaction.OperationType &&
          transaction.OperationType.operation_name === "Sale"
      );

      setData(filteredPurchaseTransactions);
      setSaleTransactionData(filteredSaleTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formattedStock = AvailableQuantity(saleTransactionData, data);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/paymenttypes/getAll");
      setpaymentTypeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchCustomerData = async () => {
    try {
      const response = await axiosInstance.get("/contributorname/getAll");

      const filteredData = response.data.filter(
        (item) => item.contributor_type_id === 1
      );

      setCustomer(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchShop = async () => {
    try {
      const response = await axiosInstance.get("/shopname/getAll");

      setShopNAmeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchVatData = async () => {
    try {
      const response = await axiosInstance.get("/tax/getAll");

      setVatData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateInvoiceNumber = () => {
    const validInvoiceNumbers = saleTransactionData
      .map((item) => parseFloat(item.invoice_no))
      .filter((number) => !isNaN(number));

    if (validInvoiceNumbers.length === 0) {
      setInvoice(1);
    } else {
      const maxInvoiceNumber = Math.max(...validInvoiceNumbers);

      setInvoice(maxInvoiceNumber + 1);
    }
  };
  useEffect(() => {
    // Check if data has changed and generate invoice number accordingly
    if (data.length > 0) {
      generateInvoiceNumber();
    }
  }, [data.length, generateInvoiceNumber, saleTransactionData]);

  useEffect(() => {
    handleDataFetch();
    fetchData();
    fetchCustomerData();
    fetchShop();
    fetchVatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customerName) {
      const result = customerData.find(
        (item) => item.contributor_name === customerName
      );
      if (result) {
        setCustomerID(result.contributor_name_id);
        setCustomerAddress(result.address);
        setCustomerPhone(result.mobile);
      } else {
        setCustomerID("");
        setCustomerAddress("");
        setCustomerPhone("");
      }
    }
  }, [customerName, customerData]);

  // Pop Up Window
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const initialItems = Array.from({ length: 1 }, () => ({
    itemCode: "",
    product_name: "",
    product_type: "",
    sale_price: "",
    quantity: "",
    itemTotal: "",
    unit: "",
    product_trace_id: "",
    unit_id: "",
    purchase_price: "",
  }));

  const [items, setItems] = useState(initialItems);

  const inputRefs = useRef([]);

  // Function to add a new row with refs
  const addRowRefs = () => {
    inputRefs.current.push(
      Array.from({ length: items.length }, () => React.createRef())
    );
  };
  useEffect(() => {
    // Focus on the first input field of the first row when the component mounts
    if (inputRefs.current[0] && inputRefs.current[0][0]?.current) {
      inputRefs.current[0][0].current.focus();
    }
  }, []);
  // Call addRowRefs function whenever you need to add a new row
  addRowRefs();

  const handleKeyPress = (event, rowIndex, colIndex) => {
    if (event.key === "Enter") {
      // Handle Enter key press
      event.preventDefault();

      if (
        rowIndex === items.length - 1 &&
        items[rowIndex].itemTotal !== "" &&
        items[rowIndex].unit !== ""
      ) {
        // Add a new row
        setItems([
          ...items,
          {
            itemCode: "",
            product_name: "",
            product_type: "",
            sale_price: "",
            quantity: "",
            itemTotal: "",
            unit: "",
            product_trace_id: "",
            unit_id: "",
            purchase_price: "",
          },
        ]);

        // Focus on the first input field of the newly added row
        setTimeout(() => {
          const nextRowIndex = rowIndex + 1;
          const nextRowInputField = inputRefs.current[nextRowIndex][0].current;
          if (nextRowInputField) {
            nextRowInputField.focus(); // Focus on the input field of the next row
          }
        });
      } else if (colIndex < 6) {
        // Move focus to the next input field in the same row
        setTimeout(() => {
          if (
            inputRefs.current[rowIndex] &&
            inputRefs.current[rowIndex][colIndex + 1]?.current
          ) {
            inputRefs.current[rowIndex][colIndex + 1].current.focus();
          }
        });
      }
    } else if (event.key === "Delete") {
      // Handle Delete key press
      event.preventDefault();

      // Check if the current row index is greater than 0
      if (rowIndex > 0) {
        // Confirm deletion
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this row?"
        );
        if (confirmDelete) {
          // Delete the current row
          const updatedItems = items.filter(
            (item, index) => index !== rowIndex
          );
          setItems(updatedItems);
        }
      }
    }
  };

  const getFieldName = (index) => {
    switch (index) {
      case 0:
        return "itemCode";
      case 1:
        return "product_name";
      case 2:
        return "product_type";
      case 3:
        return "sale_price";
      case 4:
        return "quantity";
      case 5:
        return "itemTotal";
      case 6:
        return "unit";
      default:
        return "";
    }
  };

  const totalAmount =
    items && items.length > 0
      ? items.reduce((total, item) => {
          const salePrice = parseFloat(item.sale_price) || 0;
          const quantity = parseFloat(item.quantity) || 0;
          const itemTotal = Math.round(salePrice * quantity);
          total += itemTotal;
          return total;
        }, 0)
      : 0;

  const discountAmount =
    Math.round(totalAmount * (parseFloat(discount) / 100)) || "";
  const totalWithDiscount =
    Math.round(totalAmount - discountAmount) || totalAmount;

  useEffect(() => {
    if (VAT && totalWithDiscount) {
      const vatAmount = Math.round(totalWithDiscount * (VAT / 100));
      const totalWithVAT = Math.round(totalWithDiscount + vatAmount);
      setNetTotal(totalWithVAT);
      setVatAmount(vatAmount);
    } else {
      setNetTotal(totalWithDiscount);
    }
  }, [VAT, totalWithDiscount]);

  const chargeWithAmount = Math.round(
    netTotal + (parseInt(cuttingCharge) || 0) + (parseInt(dressingCharge) || 0)
  );

  useEffect(() => {
    if (!pay) {
      setPaid(0);
      return;
    }
    if (parseInt(pay) > chargeWithAmount) {
      const changed = parseInt(pay) - chargeWithAmount;
      setPaid(chargeWithAmount);
      setChangeAmount(changed);
      return;
    }
    if (parseInt(pay) < chargeWithAmount) {
      setPaid(pay);
      setChangeAmount(0);
      return;
    } else {
      setPaid(pay);
    }
  }, [chargeWithAmount, pay]);

  useEffect(() => {
    const dueAmount =
      paid > 0
        ? parseFloat(chargeWithAmount) - parseFloat(paid)
        : chargeWithAmount;
    setDue(dueAmount);
  }, [chargeWithAmount, paid]);

  const handleReset = () => {
    setItems([
      {
        itemCode: "",
        product_name: "",
        product_type: "",
        sale_price: "",
        quantity: "",
        itemTotal: "",
        unit: "",
        product_trace_id: "",
        unit_id: "",
        purchase_price: "",
      },
    ]);

    setCustomerName("");
    setDiscount("");
    setVAT(0);
    setVatAmount("");
    setpay("");
    setsaleData([]);
    setChangeAmount("");
    setCuttingCharge("");
    setDressingCharge("");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = async (event) => {
    if (event.detail > 1) {
      return;
    }
    const charge =
      (parseInt(cuttingCharge) || 0) + (parseInt(dressingCharge) || 0);
    const newTransactions = items
      .filter((item) =>
        Object.values(item).some((val) => val !== "" && val !== null)
      )
      .map((item) => ({
        invoice_no: invoice,
        product_trace_id: item.product_trace_id,
        quantity_no: item.quantity,
        unit_id: item.unit_id || null,
        warranty: "None",
        tax_id: vatID || 0,
        amount: chargeWithAmount,
        authorized_by_id: 1,
        contributor_name_id: customerID || null,
        operation_type_id: 1,
        date: formattedDateTime,
        payment_type_id: payment_id || null,
        shop_name_id: shopNameData.map((data) => data?.shop_name_id) || null,
        paid: paid || 0,
        employee_id: Employee || "none",
        sale_price: item.sale_price,
        discount: discount,
        purchase_price: item.purchase_price,
        other_cost: charge,
      }));

    setFixData(items);
    if (netTotal === 0) {
      toast.dismiss();

      // Show a new toast
      toast.warning("Please fill all required fields before Save the item.", {
        autoClose: 1000, // Adjust the duration as needed (1 second = 1000 milliseconds)
      });

      return;
    }
    console.log("newTransactions", newTransactions);
    try {
      const response = await axiosInstance.post(
        "/transactionsRouter/postTransactionFromAnyPageBulk",
        newTransactions,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        handleDataFetch();
        generateInvoiceNumber();
        handlePrint();
        handleReset();
        toast.dismiss();
        toast.success("Data saved successfully!");
        console.log(response.data);
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data. Please try again later.");
      handleReset();
    }
  };

  const handleCustomerSave = async (event) => {
    if (event.detail > 1) {
      return;
    }
    if (contributor_name === "" && (address === "") & (mobile === "")) {
      setcontributorNameError("Can't leave empty field");
      setAddressError("Can't leave empty field");
      setMobileError("Can't leave empty field");
      return;
    }
    if (contributor_name === "") {
      setcontributorNameError("Can't leave empty field");

      return;
    }
    if (address === "") {
      setAddressError("Can't leave empty field");
      return;
    }
    if (mobile === "") {
      setMobileError("Can't leave empty field");
      return;
    }
    const contributor_type_id = 1;

    try {
      const response = await axiosInstance.post(
        "/contributorname/postContributorNameFromAnyPage",
        { contributor_name, address, mobile, contributor_type_id }
      );
      if (response.status === 200) {
        setContributorName("");
        setAddress("");
        setMobile("");
        fetchCustomerData();
        toast.success("Customer Add successfully!");
      } else {
        toast.error("Failed to save Supplier");
      }
    } catch (error) {
      console.error("Error saving brand name:", error);
    }
  };

  useEffect(() => {
    const filteredData = VatData.find((item) => item.rate === VAT);
    setVatID(filteredData?.tax_id);
  }, [VatData, VAT]);

  // const due = parseFloat(netTotal) - parseFloat(pay) || 0;

  return (
    <div className="full_div_super_shop_sale">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="frist_row_div_supershop_sale"></div>
      <div className="second_row_div_supershop_sale">
        <div className="container_table_supershop_sale">
          <table border={1} cellSpacing={2} cellPadding={10}>
            <thead>
              <tr>
                <th>BarCode*</th>
                <th>Product Name*</th>
                <th>Product Type</th>
                <th>Sale Price*</th>
                <th>Quantity*</th>
                <th>Item Total*</th>
                <th>Unit*</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(item)
                    .slice(0, 7)
                    .map((fieldName, colIndex) => (
                      <td key={colIndex}>
                        <input
                          type="text"
                          className="table_input_field"
                          ref={inputRefs.current[rowIndex][colIndex]}
                          list={
                            getFieldName(colIndex) === "itemCode"
                              ? `item_codes_${rowIndex}`
                              : getFieldName(colIndex) === "sale_price"
                              ? `sale_price_${rowIndex}`
                              : ""
                          }
                          value={item[fieldName]}
                          readOnly={
                            ![0, 3, 4].includes(colIndex) // Make fields read-only if not Barcode, Sale Price, or quantity
                          }
                          style={{
                            backgroundColor: ![0, 4, 3].includes(colIndex)
                              ? "white"
                              : "", // Set background color to white for read-only fields
                          }}
                          onChange={(e) => {
                            const { value } = e.target;
                            const updatedItems = [...items];
                            updatedItems[rowIndex][fieldName] = value;

                            if (fieldName === "itemCode") {
                              const matchedProduct = [...data]
                                .reverse()
                                .find(
                                  (product) =>
                                    product.ProductTrace &&
                                    product.ProductTrace.product_code === value
                                );

                              if (matchedProduct) {
                                const saleData =
                                  data &&
                                  data.filter(
                                    (product) =>
                                      product.ProductTrace &&
                                      product.ProductTrace.product_code ===
                                        value
                                  );
                                setsaleData(saleData);

                                // Retrieve available quantity from formatted stock
                                const Aviablequantity = formattedStock.find(
                                  (data) =>
                                    data.ProductCode ===
                                    updatedItems[rowIndex]["itemCode"]
                                );

                                setAvailable(Aviablequantity);

                                // Update product details based on the matched product
                                // ...

                                updatedItems[rowIndex]["product_name"] =
                                  matchedProduct.ProductTrace?.name;
                                updatedItems[rowIndex]["product_type"] =
                                  matchedProduct.ProductTrace?.type;
                                updatedItems[rowIndex]["sale_price"] =
                                  matchedProduct.sale_price;
                                updatedItems[rowIndex]["purchase_price"] =
                                  matchedProduct.purchase_price;
                                updatedItems[rowIndex]["unit"] =
                                  matchedProduct.Unit?.unit;
                                updatedItems[rowIndex]["unit_id"] =
                                  matchedProduct.Unit?.unit_id;
                                updatedItems[rowIndex]["product_trace_id"] =
                                  matchedProduct.ProductTrace?.product_trace_id;
                              } else {
                                updatedItems[rowIndex]["product_name"] = "";
                                updatedItems[rowIndex]["product_type"] = "";
                                updatedItems[rowIndex]["sale_price"] = "";
                                updatedItems[rowIndex]["unit"] = "";
                                updatedItems[rowIndex]["quantity"] = "";
                                updatedItems[rowIndex]["purchase_price"] = "";
                                setpay("");
                                setsaleData([]);
                              }
                            }

                            const salePrice = parseFloat(
                              updatedItems[rowIndex]["sale_price"]
                            ).toFixed(2);
                            const quantity = parseFloat(
                              updatedItems[rowIndex]["quantity"]
                            ).toFixed(2);
                            if (fieldName === "quantity") {
                              // Parse entered quantity
                              const enteredQuantity = parseFloat(value);
                              console.log(available?.availableQuantity);
                              if (
                                enteredQuantity >
                                parseFloat(available?.availableQuantity)
                              ) {
                                toast.dismiss();
                                toast.warning(
                                  `The entered quantity exceeds the available quantity. ${available?.availableQuantity} ${available?.unit}`
                                );
                              }
                            }
                            updatedItems[rowIndex]["itemTotal"] =
                              isNaN(salePrice) || isNaN(quantity)
                                ? ""
                                : Math.round(salePrice * quantity);
                            setItems(updatedItems);
                          }}
                          onKeyDown={(e) =>
                            handleKeyPress(e, rowIndex, colIndex)
                          }
                        />
                        {fieldName === "sale_price" && (
                          <datalist id={`sale_prices_${rowIndex}`}>
                            {/* Populate options with sale prices for the scanned product */}
                            {saleData.map((product) => (
                              <option
                                key={product.product_trace_id}
                                value={product.sale_price}
                              />
                            ))}
                          </datalist>
                        )}
                        {fieldName === "itemCode" && (
                          <datalist id={`item_codes_${rowIndex}`}>
                            {/* Populate options with sale prices for the scanned product */}
                            {data.length > 0 && (
                              <>
                                {[
                                  ...new Set(
                                    data.map(
                                      (item) => item.ProductTrace?.product_code
                                    )
                                  ),
                                ].map((productCode, index) => (
                                  <option key={index}>{productCode}</option>
                                ))}
                              </>
                            )}
                          </datalist>
                        )}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="third_row_div_supershop_sale">
        <div className="container_buttom_full_div">
          <div className="container_div_view_customer_supershop_sale">
            <div className="customer_setup_supershop_sale">
              <div className="customer_setup_supershop_sale_box">
                <div className="membership_customer">
                  Permanent Customer
                  <input
                    type="checkbox"
                    style={{ marginLeft: "4px" }}
                    onChange={(e) => setCheckBox(e.target.checked)}
                  />
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    list="list_customer"
                    disabled={checkbox ? false : true}
                  />
                  <datalist id="list_customer">
                    {checkbox &&
                      customerData.length > 0 &&
                      customerData.map((customer, index) => {
                        return (
                          <option key={index} value={customer.contributor_name}>
                            {customer.contributor_name}
                          </option>
                        );
                      })}
                  </datalist>
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer ID</label>
                  <input
                    type="number"
                    style={{ width: "8vw" }}
                    value={customerID}
                    disabled={checkbox ? false : true}
                  />
                  <Button style={{ width: "3.5vw" }} onClick={showModal}>
                    +
                  </Button>
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    disabled={checkbox ? false : true}
                  />
                </div>
                <div className="input_field_supershop_sale">
                  <label>Customer Address</label>
                  <input
                    type="text"
                    value={customerAddress}
                    disabled={checkbox ? false : true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="container_shadow_extra">
            <div className="container_input_field_box_supershop_sale">
              <div className="">
                <div className="input_field_bottom_supershop_sale">
                  <label>payment Type*</label>

                  <select
                    value={payment_id}
                    onChange={(e) => setpaymentId(e.target.value)}
                  >
                    {paymentTypeData &&
                      paymentTypeData.map((data) => (
                        <option
                          key={data.payment_type_id}
                          value={data.payment_type_id}
                        >
                          {data.payment_type}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Current Date*</label>
                  <input
                    value={currentDate}
                    className="date_input_sale_page"
                    type="date"
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Shop Name</label>

                  <input
                    type="text"
                    value={shopNameData.map((data) => data.shop_name)}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Employee </label>
                  <input type="text" value={Employee} />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Total</label>
                  <input type="number" value={totalAmount} />
                </div>
              </div>
              <div className="container_div_saparator_supershop_sale_column2">
                <div className="input_field_bottom_supershop_sale">
                  <label>Discount</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    className="vat_select_field"
                  />
                  <span style={{ fontWeight: "bold" }}>%</span>
                  <input
                    type="text"
                    value={discountAmount}
                    className="vat_amount_sale_page"
                    disabled
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Vat</label>
                  <select
                    value={VAT}
                    type="number"
                    onChange={(e) => setVAT(e.target.value)}
                    className="vat_select_field"
                  >
                    {VatData.length > 0 &&
                      VatData.map((vat) => {
                        return (
                          <option key={vat.tax_id} value={vat.rate}>
                            {vat.rate}
                          </option>
                        );
                      })}
                  </select>
                  <span style={{ fontWeight: "bold" }}>%</span>
                  <input
                    type="text"
                    value={vatAmount}
                    className="vat_amount_sale_page"
                    disabled
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Cutting Charge</label>
                  <input
                    type="number"
                    value={cuttingCharge}
                    onChange={(e) => setCuttingCharge(e.target.value)}
                    required
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Dressing Charge</label>
                  <input
                    type="number"
                    value={dressingCharge}
                    onChange={(e) => setDressingCharge(e.target.value)}
                    required
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Net Total</label>
                  <input
                    type="number"
                    value={chargeWithAmount || netTotal}
                    disabled
                  />
                </div>
              </div>
              <div className="container_div_saparator_supershop_sale_column2">
                <div className="input_field_bottom_supershop_sale">
                  <label>Payment</label>
                  <input
                    type="number"
                    value={pay}
                    onChange={(e) => setpay(e.target.value)}
                  />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Change</label>
                  <input type="number" value={changeAmount} disabled />
                </div>

                <div className="input_field_bottom_supershop_sale">
                  <label>Paid</label>
                  <input type="number" value={paid} disabled />
                </div>
                <div className="input_field_bottom_supershop_sale">
                  <label>Due</label>
                  <input type="number" value={due} disabled />
                </div>
              </div>
              <div className="container_billing_supershop_sale">
                <div className="button-shadow-supershop-sale">
                  <div style={{ display: "none" }}>
                    <PosInvoice
                      ref={componentRef}
                      discount={discount}
                      VAT={VAT}
                      fixData={fixData}
                      netTotal={chargeWithAmount}
                      pay={pay}
                      due={due}
                      change={changeAmount}
                      cuttingCharge={cuttingCharge}
                      dressingCharge={dressingCharge}
                      invoice_no={invoice}
                      vatAmount={vatAmount}
                      discountAmount={discountAmount}
                      saleBy={Employee}
                    />
                  </div>
                  <button
                    className="billing_button_supershop_sale"
                    onClick={handleSave}
                  >
                    <img src={Invoice} alt="billing" />
                  </button>
                </div>
                <span>Invoice</span>
              </div>
              <div className="container_billing_supershop_sale">
                <div className="button-shadow-supershop-sale">
                  <button
                    className="billing_button_supershop_sale"
                    style={{ cursor: "pointer" }}
                    onClick={handleReset}
                  >
                    <img src={reset} alt="billing" />
                  </button>
                </div>
                <span>Reset</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="popup-window_supershop">
        <Modal
          title="Add MemberShip Customer"
          open={isModalOpen}
          onCancel={handleCancel}
          width={500}
          height={800}
          footer={null}
          style={{
            top: 46,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className="container_permanent_supplier_supershop">
            <div className="first_row_div_permanent_supplier_supershop">
              <div className="container_search_permanent_supplier_supershop">
                <div className="container_separate_permanent_supplier_supershop">
                  <div>
                    <div className="search_permanent_supplier_supershop">
                      <div className="search_permanent_supplier_supershop_column1">
                        <div className="input_field_permanent_supplier_supershop">
                          <label>Customer Name</label>
                          <input
                            type="text"
                            value={contributor_name}
                            onChange={(e) => setContributorName(e.target.value)}
                            style={{
                              borderColor:
                                contributorNameError && contributor_name === ""
                                  ? "red"
                                  : "",
                            }}
                          />
                          <div className="error_message_customer">
                            {contributorNameError && contributor_name === ""
                              ? contributorNameError
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="search_permanent_supplier_supershop_column2">
                        <div className="input_field_permanent_supplier_supershop">
                          <label>Mobile</label>
                          <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            style={{
                              borderColor:
                                mobileError && mobile === "" ? "red" : "",
                            }}
                          />
                          <div className="error_message_customer">
                            {mobileError && mobile === "" ? mobileError : ""}
                          </div>
                        </div>
                        <div className="input_field_permanent_supplier_supershop">
                          <label>Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                              borderColor:
                                addressError && address === "" ? "red" : "",
                            }}
                          />
                          <div className="error_message_customer">
                            {addressError && address === "" ? addressError : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="save_button">
                      <button
                        className="button_supershop button2"
                        onClick={handleCustomerSave}
                      >
                        <img src={Save} alt="" />
                      </button>
                      Save
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="second_row_modal">
              <div className="table_div_modal">
                <table border={1} cellSpacing={1} cellPadding={2}>
                  <tr>
                    <th style={Color}>Customer Id</th>
                    <th style={Color}>Name</th>
                    <th style={Color}>Mobile</th>
                    <th style={Color}>Address</th>
                  </tr>
                  {customerData &&
                    customerData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.contributor_name}</td>
                        <td>{item.mobile}</td>
                        <td>{item.address}</td>
                      </tr>
                    ))}
                </table>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      {/* <div className="deleteModal_container">
          <Modal
            title={null}
            open={rowDeleteModal}
            onCancel={() => setRowDeltemodal(false)}
            footer={null}
            closable={false}
            styles={{ padding: 0, margin: 0 }}
            style={{
              top: 150,
              bottom: 0,
              left: 120,
              right: 0,
              maxWidth:  "24%" ,
              minWidth: "16%" ,
              height: "2vh",
            }}
          >
           
              <div className="rackDeleteModal">
                <div className="delete_modal">
                  <div className="delete_modal_box">
                    <p className="delete_popup_text">
                      Are you sure to delete this rack?
                    </p>
                    <p className="delete_popup_revert_text">
                      You won't be able to revert this!
                    </p>

                    <div className="delete_modal_btn_div">
                      <button
                        className="delete_modal_buttonCancel"
                        onClick={() => {
                          setRowDeltemodal(false);
                          
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRowDelete}
                        className="delete_modal_buttoDelete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            
            
          </Modal>
        </div> */}
    </div>
  );
};

export default SalePage;
