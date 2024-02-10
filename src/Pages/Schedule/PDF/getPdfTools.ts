export const getPdfTools = async () => {
  const {Page, Text, View, Document, StyleSheet, pdf, Image} = await import(
    "@react-pdf/renderer"
  );

  const styles = StyleSheet.create({
    body: {
      padding: 5,
    },
    table: {
      display: "flex",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    headerRow: {
      backgroundColor: "#f0f0f0",
    },
    tableCol: {
      width: "12.5%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableRosterCol: {
      width: "33.33%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    empCol: {
      backgroundColor: "#f0f0f0",
    },
    headerCell: {
      margin: 3,
      textAlign: "center",
      fontSize: 12,
    },
    employeeTitle: {
      margin: 2,
      fontSize: 10,
      fontWeight: "bold",
      textOverflow: "ellipsis",
    },
    employeeSubtitle: {
      margin: 2,
      fontSize: 8,
    },
  });

  return {
    Page,
    Text,
    View,
    Document,
    pdf,
    Image,
    styles,
  };
};
