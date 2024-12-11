import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { EstimateType } from '../../types/estimates';
import treeImage from '../../assets/tree.png';  

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 50,
    height: 50,
    marginLeft: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyTagline: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 9,
    marginBottom: 1,
  },
  clientSection: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  clientInfo: {
    fontSize: 9,
    marginBottom: 1,
  },
  estimateSection: {
    marginBottom: 15,
  },
  estimateTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workItem: {
    fontSize: 9,
    marginBottom: 2,
    marginLeft: 15,
  },
  itemsSection: {
    marginTop: 10,
  },
  itemsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  table: {
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  descriptionCol: {
    flex: 2,
    paddingRight: 8,
  },
  quantityCol: {
    width: 60,
    textAlign: 'center',
  },
  priceCol: {
    width: 80,
    textAlign: 'right',
  },
  totalCol: {
    width: 80,
    textAlign: 'right',
  },
  tableText: {
    fontSize: 9,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'right',
  },
  notes: {
    marginTop: 20,
    fontSize: 9,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  }
});

const EstimatePDFDocument = ({ estimate }: { estimate: EstimateType }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.companyName}>{estimate.business_settings?.company_name}</Text>
          <Text style={styles.companyTagline}>Growing you biz</Text>
          <Text style={styles.companyInfo}>{estimate.business_settings?.address}</Text>
          <Text style={styles.companyInfo}>DANVERS, MA 09523</Text>
          <Text style={styles.companyInfo}>{estimate.business_settings?.phone}</Text>
          <Text style={styles.companyInfo}>{estimate.business_settings?.email}</Text>
        </View>
        <View style={styles.headerRight}>
          <Image src={treeImage} style={styles.logo} />
        </View>
      </View>

      <View style={styles.clientSection}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        <Text style={styles.clientInfo}>Name: {estimate.client_info?.name}</Text>
        <Text style={styles.clientInfo}>Phone: {estimate.client_info?.phone}</Text>
        <Text style={styles.clientInfo}>Email: {estimate.client_info?.email}</Text>
        <Text style={styles.clientInfo}>Address: {estimate.client_info?.address}</Text>
      </View>

      <View style={styles.estimateSection}>
        <Text style={styles.estimateTitle}>Estimate</Text>
        
        <View style={styles.description}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.workItem}>Work to be performed:</Text>
          {estimate.line_items?.map((item, index) => (
            <Text key={index} style={styles.workItem}>• {item.description} ({item.quantity} × ${item.unit_price.toFixed(2)})</Text>
          ))}
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.itemsTitle}>Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.descriptionCol, styles.tableText]}>Description</Text>
              <Text style={[styles.quantityCol, styles.tableText]}>Quantity</Text>
              <Text style={[styles.priceCol, styles.tableText]}>Unit Price</Text>
              <Text style={[styles.totalCol, styles.tableText]}>Total</Text>
            </View>

            {estimate.line_items?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.descriptionCol, styles.tableText]}>{item.description}</Text>
                <Text style={[styles.quantityCol, styles.tableText]}>{item.quantity}</Text>
                <Text style={[styles.priceCol, styles.tableText]}>${item.unit_price.toFixed(2)}</Text>
                <Text style={[styles.totalCol, styles.tableText]}>
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                ${estimate.line_items
                  ?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
                  .toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {estimate.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text>{estimate.notes}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export const EstimatePDFLink = ({ estimate }: { estimate: EstimateType }) => (
  <PDFDownloadLink
    document={<EstimatePDFDocument estimate={estimate} />}
    fileName={`estimate-${estimate.id}.pdf`}
  >
    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
  </PDFDownloadLink>
);

export default EstimatePDFDocument;
