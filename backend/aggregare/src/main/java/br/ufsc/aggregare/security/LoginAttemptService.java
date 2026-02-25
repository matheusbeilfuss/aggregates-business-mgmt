package br.ufsc.aggregare.security;

import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Component
public class LoginAttemptService {

	private static final int MAX_ATTEMPTS = 5;
	private static final int LOCK_MINUTES = 5;
	private static final int MAX_CACHE_SIZE = 10_000;

	private final Cache<String, Integer> userAttempts = Caffeine.newBuilder()
			.expireAfterWrite(LOCK_MINUTES, TimeUnit.MINUTES)
			.maximumSize(MAX_CACHE_SIZE)
			.build();

	public void loginFailed(String username) {
		if (username != null && !isBlocked(username)) {
			userAttempts.asMap().merge(username, 1, Integer::sum);
		}
	}

	public void loginSucceeded(String username) {
		if (username != null) {
			userAttempts.invalidate(username);
		}
	}

	public boolean isBlocked(String username) {
		if (username == null) return false;
		Integer attempts = userAttempts.getIfPresent(username);
		return attempts != null && attempts >= MAX_ATTEMPTS;
	}

	public int getRemainingAttempts(String username) {
		if (username == null) return MAX_ATTEMPTS;
		Integer attempts = userAttempts.getIfPresent(username);
		return Math.max(0, MAX_ATTEMPTS - (attempts == null ? 0 : attempts));
	}
}
