package org.openmetadata.service.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.antlr.v4.runtime.misc.ParseCancellationException;
import org.junit.jupiter.api.Test;

class FullyQualifiedNameTest {
  private record FQNTest(String[] parts, String fqn) {
    public void validate(String[] actualParts, String actualFQN) {
      assertEquals(fqn, actualFQN);
      assertEquals(parts.length, actualParts.length);
      for (int i = 0; i < parts.length; i++) {
        if (parts[i].contains(".")) {
          assertEquals(FullyQualifiedName.quoteName(parts[i]), actualParts[i]);
        } else {
          assertEquals(parts[i], actualParts[i]);
        }
      }
    }
  }

  @Test
  void test_build_split() {
    List<FQNTest> list =
        List.of(
            new FQNTest(new String[] {"a", "b", "c", "d"}, "a.b.c.d"),
            new FQNTest(new String[] {"a.1", "b", "c", "d"}, "\"a.1\".b.c.d"),
            new FQNTest(new String[] {"a", "b.2", "c", "d"}, "a.\"b.2\".c.d"),
            new FQNTest(new String[] {"a", "b", "c.3", "d"}, "a.b.\"c.3\".d"),
            new FQNTest(new String[] {"a", "b", "c", "d.4"}, "a.b.c.\"d.4\""),
            new FQNTest(new String[] {"a.1", "b.2", "c", "d"}, "\"a.1\".\"b.2\".c.d"),
            new FQNTest(new String[] {"a.1", "b.2", "c.3", "d"}, "\"a.1\".\"b.2\".\"c.3\".d"),
            new FQNTest(
                new String[] {"a.1", "b.2", "c.3", "d.4"}, "\"a.1\".\"b.2\".\"c.3\".\"d.4\""));
    for (FQNTest test : list) {
      String[] actualParts = FullyQualifiedName.split(test.fqn);
      String actualFqn = FullyQualifiedName.build(test.parts);
      test.validate(actualParts, actualFqn);
    }
  }

  @Test
  void test_quoteName() {
    assertEquals("a", FullyQualifiedName.quoteName("a")); // Unquoted name remains unquoted
    assertEquals("\"a.b\"", FullyQualifiedName.quoteName("a.b")); // Add quotes when "." in the name
    assertEquals("\"a.b\"", FullyQualifiedName.quoteName("\"a.b\"")); // Leave existing valid quotes
    assertEquals("a", FullyQualifiedName.quoteName("\"a\"")); // Remove quotes when not needed
    // we now allow quotes
    assertEquals("\\\"a", FullyQualifiedName.quoteName("\"a"));
    assertEquals("a\\\"", FullyQualifiedName.quoteName("a\""));
    assertEquals("a\\\"b", FullyQualifiedName.quoteName("a\"b"));
  }

  @Test
  void test_unquoteName() {
    assertEquals("a", FullyQualifiedName.unquoteName("a")); // Unquoted name remains unquoted
    assertEquals("a.b", FullyQualifiedName.unquoteName("\"a.b\"")); // Leave existing valid quotes
  }

  @Test
  void test_invalid() {
    assertThrows(ParseCancellationException.class, () -> FullyQualifiedName.split("..a"));
    assertThrows(ParseCancellationException.class, () -> FullyQualifiedName.split("a.."));
  }

  @Test
  void test_getParentFQN() {
    assertEquals("a.b.c", FullyQualifiedName.getParentFQN("a.b.c.d"));
    assertEquals("\"a.b\"", FullyQualifiedName.getParentFQN("\"a.b\".c"));
    assertEquals("a", FullyQualifiedName.getParentFQN("a.b"));
    assertEquals("a", FullyQualifiedName.getParentFQN("a.\"b.c\""));
    assertEquals("a.\"b.c\"", FullyQualifiedName.getParentFQN("a.\"b.c\".d"));
    assertNull(FullyQualifiedName.getParentFQN("a"));
  }

  @Test
  void test_getRoot() {
    assertEquals("a", FullyQualifiedName.getRoot("a.b.c.d"));
    assertEquals("a", FullyQualifiedName.getRoot("a.b.c"));
    assertEquals("a", FullyQualifiedName.getRoot("a.b"));
    assertNull(FullyQualifiedName.getRoot("a"));
  }

  @Test
  void test_isParent() {
    assertTrue(FullyQualifiedName.isParent("a.b.c", "a.b"));
    assertTrue(FullyQualifiedName.isParent("a.b.c", "a"));
    assertFalse(FullyQualifiedName.isParent("a", "a.b.c"));
    assertFalse(FullyQualifiedName.isParent("a.b", "a.b.c"));
    assertFalse(FullyQualifiedName.isParent("a.b.c", "a.b.c"));
    assertFalse(FullyQualifiedName.isParent("a.b c", "a.b"));
  }
}
