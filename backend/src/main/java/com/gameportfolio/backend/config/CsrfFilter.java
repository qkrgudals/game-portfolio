
package com.gameportfolio.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class CsrfFilter extends OncePerRequestFilter {

    public static final String TOKEN_KEY = "CSRF_TOKEN";

    private static final SecureRandom RANDOM =
            new SecureRandom();

    public static String getOrCreateToken(HttpSession session) {
        String token = (String) session.getAttribute(TOKEN_KEY);

        if (token == null) {
            byte[] bytes = new byte[32];
            RANDOM.nextBytes(bytes);

            token = Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(bytes);

            session.setAttribute(TOKEN_KEY, token);
        }

        return token;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String method = request.getMethod();

        boolean stateChanging =
                method.equals("POST")
                        || method.equals("PUT")
                        || method.equals("PATCH")
                        || method.equals("DELETE");

        // 회원탈퇴 요청에 CSRF 검증 적용
        boolean protectedRequest =
                method.equals("DELETE")
                        && request.getServletPath().equals("/api/users/me");

        if (stateChanging && protectedRequest) {
            HttpSession session = request.getSession(false);

            String expected = session == null
                    ? null
                    : (String) session.getAttribute(TOKEN_KEY);

            String provided = request.getHeader("X-CSRF-TOKEN");

            if (expected == null || provided == null
                    || !MessageDigest.isEqual(
                    expected.getBytes(StandardCharsets.UTF_8),
                    provided.getBytes(StandardCharsets.UTF_8)
            )) {

                response.sendError(
                        HttpServletResponse.SC_FORBIDDEN,
                        "CSRF 토큰이 올바르지 않습니다."
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
