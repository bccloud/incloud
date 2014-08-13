import java.io.IOException;
import java.net.Authenticator;
import java.net.HttpURLConnection;
import java.net.PasswordAuthentication;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;


public class incloud {
	public static void main(String[] args) throws IOException, DocumentException, NoSuchAlgorithmException {
	    Authenticator.setDefault(new DefaultAuthenticator());
	    String capiUrl="http://192.168.113.203:8080/login", 
			   username="wangjh" ,
			   password="wjh_bcc";
		URL saltUrl = new URL(capiUrl+"/"+username);
		Object salt = result(con(saltUrl,"GET")).getData();
		URL loginUrl = new URL(capiUrl+"?"+"login="+username+"&digest="+encode("SHA-1","--"+salt+"--"+password+"--"));		
		Element User=result(con(loginUrl,"POST"));
		userName(User);
	}
	public static HttpURLConnection con(URL url,String method) throws IOException {
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestProperty("Accept", "application/xml");
		connection.setRequestMethod(method);
		return connection;
	}
	public static Element result(HttpURLConnection connection) throws DocumentException, IOException{
		SAXReader reader = new SAXReader(); 
        Document document = reader.read(connection.getInputStream()); 
        return document.getRootElement();
	}
	public static void userName(Element User) {
		Element firstName = (Element) User.elementIterator("first_name").next();
		Element lastName = (Element) User.elementIterator("last_name").next();
		System.out.println("Hello "+firstName.getData()+lastName.getData()+",你已成功登录inCloud!");
	}
	
	 public static String encode(String algorithm, String str) throws NoSuchAlgorithmException {
		             MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
		             messageDigest.update(str.getBytes());
		             return byte2hex(messageDigest.digest());
	 }
	 private static String byte2hex(byte[] buffer) {
		 StringBuffer sb = new StringBuffer(buffer.length * 2);  
		 for (int i = 0; i < buffer.length; i++) {  
	            sb.append(Character.forDigit((buffer[i] & 240) >> 4, 16));  
	            sb.append(Character.forDigit(buffer[i] & 15, 16));  
		 }
		 return sb.toString();  
	 }
}

class DefaultAuthenticator extends Authenticator {
	public PasswordAuthentication getPasswordAuthentication() {
		  String  capiUser="admin",
		    capiPass="tot@ls3crit";
		return new PasswordAuthentication(capiUser, capiPass.toCharArray());
	}
}