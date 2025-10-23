import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    flexGrow:1,
    backgroundColor: '#f2f3f5',
  },
  headerContainer: {
    backgroundColor: '#6a3eb2',
    padding: 15,
    paddingTop:40,
    paddingRight:10,
    paddingLeft:10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 10,

  },
  appTitle: {
    fontWeight:'bold',
    fontSize:18,
    color:'#FFFFE0'
    //fontFamily:'Pacifico-Regular',
  },
  appSubtitle: {
    fontWeight:'300',
    fontSize:14,
    color:'#FFFFE0'
    //fontFamily:'Pacifico-Regular',
  },
  recCard:{
    padding:20,
    backgroundColor:'#fff',
    margin:5,
    borderRadius:10
  },
  sectionTitle: {
    fontWeight:'600',
    fontSize:22,
    margin:10,
    marginBottom:5,
  },
  recCardTitle: {
    fontWeight:'400',
    fontSize:20,
    margin:2,
    
  },
  recCardContent: {
    fontWeight:'400',
    fontSize:16,
    margin:2,
    
  },
  recCardFoot: {
    fontWeight:'400',
    fontSize:15,
    margin:2,
    color:'grey',
    
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12, 
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 44, // Standard touch target size
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
});