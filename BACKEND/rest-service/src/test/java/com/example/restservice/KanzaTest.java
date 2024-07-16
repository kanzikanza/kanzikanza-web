package com.example.restservice;


import com.example.restservice.kanza.controller.Kanzicontroller;
import com.example.restservice.neo4j.controller.Neo4jController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest // url을 통해서 할 수 있다.
@AutoConfigureMockMvc // 서버를 실행하지 않고도 테스트할 수있게해주는 앱
public class KanzaTest
{

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private Kanzicontroller kanzicontroller;

    @Autowired
    private Neo4jController neo4jController;

    @BeforeEach
    public void mockMvcSetUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .build();
    }


    @DisplayName("한자를 받아보는 시스템")
    @Test
    public void getKanzi() throws Exception
    {
        final String url = "/kanzi/problem";
        final ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get(url).accept(MediaType.APPLICATION_JSON));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @DisplayName("한자정보를 캐시에 저장하고 가져오는 것 까지 실행")
    @Test
    public void redisCache() throws Exception
    {
        final String url = "/kanzi/getKanza";
        final ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get(url)
                .param("kanza", "火")
                .accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @DisplayName("유저의 연결리스트 캐시를 생성하고 노드 두개를 만들어서 두개의 연결을 확인하는 코드")
    @Test
    public void redisUserCache() throws Exception
    {
        final String url = "/test/make2Nodes";

        final ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get(url)
                .param("userIndex", "1")
                .accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @DisplayName("사용자가 가장 최근에 틀린 한자를 가져오고 보여주는 내용")
    @Test
    public void redisGetUserCache() throws  Exception {
        final String url = "/test/redisGetUserCache";

        final ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get(url)
                .param("userIndex", "10")
                .param("kanzaIndex", "7059")
                .accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @DisplayName("Neo4J에 침소봉대 한자를 넣고 단어를 만든뒤 Relation으로 지목하는 것까지 하는 테스트")
    @Test
    public void neo4jTest() throws Exception {
        final String url = "/neo4j/neo4jTest";
        final ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get(url));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
    }
}
