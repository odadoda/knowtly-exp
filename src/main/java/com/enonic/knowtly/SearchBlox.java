package com.enonic.knowtly;

import com.enonic.xp.portal.script.command.CommandHandler;
import com.enonic.xp.portal.script.command.CommandRequest;
import org.osgi.service.component.annotations.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by oda on 02.07.15.
 */

@Component(immediate = true, service = CommandHandler.class)
public class SearchBlox implements CommandHandler {

    @Override
    public String getName(){ return "knowtly.searchblox"; }

    @Override
    public Object execute(CommandRequest req){

        String url = req.param("url").required().value(String.class);
        String q = req.param("q").required().value(String.class);

        String result;

        try {
            result = HttpConnection.sendGet(url, q);
        } catch (Exception e) {
            result = e.getLocalizedMessage();
            e.printStackTrace();
        }

        return result;
    }
}


class HttpConnection {
    static public String sendGet(String url, String q) throws Exception {

        URL obj = new URL(url + "?query="+q + "&xsl=json");
        HttpURLConnection connection = (HttpURLConnection) obj.openConnection();

        connection.setRequestProperty("User-Agent", "Mozilla/5.0");

        int responseCode = connection.getResponseCode();
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String inputLine;
        StringBuffer resultText = new StringBuffer();

        while((inputLine = in.readLine()) != null){
            resultText.append(inputLine);
        }

        //System.out.println(resultText.toString());

        return resultText.toString();
    }
}