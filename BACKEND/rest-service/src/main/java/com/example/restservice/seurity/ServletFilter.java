package com.example.restservice.seurity;

import org.springframework.util.StringUtils;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ServletFilter extends HttpFilter {
    private TokenProvider tokenProvider;

    @Override
    protected void doFilter(HttpServletRequest request,
                            HttpServletResponse response,
                            FilterChain filterChain)
                            throws IOException, ServletException {
            
                try {
                    final String token = parseBearerToken(request);

                    if (token != null && !token.equalsIgnoreCase("null")) {
                        String userId = tokenProvider.validateAndGetUserId(token);
                        filterChain.doFilter(request, response);
                    }
                } catch (Exception e) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                }

    }
    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer"));
        {
            return bearerToken.substring(7);
        }
        return null; 
    }   
}
