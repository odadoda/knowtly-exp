package com.enonic.knowtly;


import com.enonic.xp.portal.script.command.CommandHandler;
import com.enonic.xp.portal.script.command.CommandRequest;
import org.osgi.service.component.annotations.Component;

/**
 * Created by oda on 27.03.15.
 */

@Component(immediate = true, service = CommandHandler.class)
public class HelloHandler implements CommandHandler {


    @Override
    public String getName() {
        return "knowtly.hello";
    }

    @Override
    public Object execute(CommandRequest req) {
        String name = req.param("name").required().value(String.class);

        return "Hello World " + name;
    }
}


@public class SOmething implements 
