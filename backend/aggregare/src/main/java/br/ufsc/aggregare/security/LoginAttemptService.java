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

	private final Cache<String, Integer> ipAttempts = Caffeine.newBuilder()
			.expireAfterWrite(LOCK_MINUTES, TimeUnit.MINUTES)
			.maximumSize(MAX_CACHE_SIZE)
			.build();

	public void loginFailed(String username, String ip) {

		if (username != null) {
			increment(userAttempts, username);
		}

		increment(ipAttempts, ip);
	}

	public void loginSucceeded(String username, String ip) {
		if (username != null) {
			userAttempts.invalidate(username);
		}
		ipAttempts.invalidate(ip);
	}

	public boolean isBlocked(String username, String ip) {

		boolean userBlocked = false;

		if (username != null) {
			userBlocked = isMaxAttempts(userAttempts, username);
		}

		boolean ipBlocked = isMaxAttempts(ipAttempts, ip);

		return userBlocked || ipBlocked;
	}

	public int getRemainingAttempts(String username) {
		if (username == null) return MAX_ATTEMPTS;

		Integer attempts = userAttempts.getIfPresent(username);
		return MAX_ATTEMPTS - (attempts == null ? 0 : attempts);
	}

	private void increment(Cache<String, Integer> cache, String key) {
		cache.asMap().merge(key, 1, Integer::sum);
	}

	private boolean isMaxAttempts(Cache<String, Integer> cache, String key) {
		Integer attempts = cache.getIfPresent(key);
		return attempts != null && attempts >= MAX_ATTEMPTS;
	}
}
