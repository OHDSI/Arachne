package org.springmodules.jcr;

import java.io.IOException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

public interface JcrCallback<T> {

    T doInJcr(Session session) throws IOException, RepositoryException;
}
