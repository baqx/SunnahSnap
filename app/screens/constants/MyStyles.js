import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    flexGrow:1,
    backgroundColor: '#f2f3f5',
  },
  headerContainer: {
    backgroundColor: '#6a3eb2',
    padding: 10,
    paddingTop:50,
    paddingRight:10,
    paddingLeft:10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
    fontSize:20,
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
    borderColor: '#CCCCCC',
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
  title: {
    fontSize: 18,
  },
  readMoreButton: {
    padding: 10,
    paddingRight: -10,
    paddingTop: -5,
    alignItems: 'flex-end',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6a3eb2',
  },
    pickerContainer: {
    height: 40,
    width: '100%', 
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: 'white',
  },
  iconContainer: {
        top: 10,
        right: 12,
  },
  line: {
    height: 1,                
    backgroundColor: '#CCCCCC',
    marginVertical: 10,       
  },
});