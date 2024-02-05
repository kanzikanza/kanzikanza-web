package com.example.restservice.socket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

@Slf4j
@Controller
@RequiredArgsConstructor
public class messageController {

    private final SimpMessageSendingOperations simpMessageSendingOperations;

    @MessageMapping("/room/{channelId}")
    public void message(message message, @DestinationVariable("channelId") String channelId) {
        simpMessageSendingOperations.convertAndSend("/sub/channel/" + channelId, message);
    }

}
